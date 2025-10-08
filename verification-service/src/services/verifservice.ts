/*
Define a class for the verification service

*/

import crypto from 'crypto';
import os from 'os';
import axios from 'axios';
import { getDatabase } from '../lib/db';

export interface VerificationResult {
  valid: boolean;
  message: string;
  workerId: string;
  timestamp: string;
  credentialDetails?: {
    id: string;
    issuedBy: string;
    issuedAt: string;
  };
}

export class VerificationService {
  private workerId: string;
  private issuanceServiceUrl: string;

  constructor() {
    this.workerId = process.env.HOSTNAME || os.hostname();
    this.issuanceServiceUrl = process.env.ISSUANCE_SERVICE_URL || 'http://issuance-service:3000';
  }

  /**
   * Generate hash for credential
   */
  private generateCredentialHash(credential: any): string {
    const normalizedData = JSON.stringify(credential, Object.keys(credential).sort());
    return crypto.createHash('sha256').update(normalizedData).digest('hex');
  }

  /**
   * Verify a credential
   */
  public async verifyCredential(credentialData: any): Promise<VerificationResult> {
    const db = getDatabase();
    const credentialHash = this.generateCredentialHash(credentialData);
    const timestamp = new Date().toISOString();

    try {
      // Fetch all credentials from issuance service (list route is '/')
      const response = await axios.get(`${this.issuanceServiceUrl}/credentials`);
      const issuedCredentials = response.data.credentials || [];

      // Find matching credential
      const matchingCredential = issuedCredentials.find(
        (cred: any) => cred.credentialHash === credentialHash
      );

      const verified = !!matchingCredential;

      // Log verification attempt
      db.prepare(
        'INSERT INTO verification_logs (credential_hash, verified, worker_id, verified_at, credential_data) VALUES (?, ?, ?, ?, ?)'
      ).run(credentialHash, verified ? 1 : 0, this.workerId, timestamp, JSON.stringify(credentialData));

      if (verified) {
        return {
          valid: true,
          message: `verified by ${this.workerId}`,
          workerId: this.workerId,
          timestamp,
          credentialDetails: {
            id: matchingCredential.id,
            issuedBy: matchingCredential.workerId,
            issuedAt: matchingCredential.issuedAt
          }
        };
      } else {
        return {
          valid: false,
          message: `credential not found - verified by ${this.workerId}`,
          workerId: this.workerId,
          timestamp
        };
      }
    } catch (error) {
      console.error('Error verifying credential:', error);
      
      // Log failed verification attempt
      db.prepare(
        'INSERT INTO verification_logs (credential_hash, verified, worker_id, verified_at, credential_data) VALUES (?, ?, ?, ?, ?)'
      ).run(credentialHash, 0, this.workerId, timestamp, JSON.stringify(credentialData));

      return {
        valid: false,
        message: `verification failed - checked by ${this.workerId}`,
        workerId: this.workerId,
        timestamp
      };
    }
  }

  /**
   * Get verification history
   */
  public getVerificationHistory(limit: number = 100): any[] {
    const db = getDatabase();
    const rows = db.prepare(
      `SELECT * FROM verification_logs
       WHERE id IN (
         SELECT MAX(id) FROM verification_logs GROUP BY credential_hash
       )
       ORDER BY verified_at DESC
       LIMIT ?`
    ).all(limit);

    return rows.map((row: any) => ({
      id: row.id,
      credentialHash: row.credential_hash,
      verified: row.verified === 1,
      workerId: row.worker_id,
      verifiedAt: row.verified_at,
      credentialData: JSON.parse(row.credential_data)
    }));
  }
}
