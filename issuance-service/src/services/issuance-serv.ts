import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import os from 'os';
import { getDatabase } from '../Database/db';

export interface Credential {
  id: string;
  credentialData: any;
  credentialHash: string;
  workerId: string;
  issuedAt: string;
}

export class CredentialService {
  private workerId: string;

  constructor() {
    this.workerId = process.env.HOSTNAME || os.hostname();
  }

  /**
   * Generate hash for credential to check duplicates
   */
  private generateCredentialHash(credential: any): string {
    const normalizedData = JSON.stringify(credential, Object.keys(credential).sort());
    return crypto.createHash('sha256').update(normalizedData).digest('hex');
  }

  /**
   * Issue a new credential
   */
  public issueCredential(credentialData: any): { 
    success: boolean; 
    credential?: Credential; 
    message: string; 
    workerId: string;
  } {
    const db = getDatabase();
    const credentialHash = this.generateCredentialHash(credentialData);

    // Check if credential already exists
    const existing = db.prepare(
      'SELECT * FROM credentials WHERE credential_hash = ?'
    ).get(credentialHash);

    if (existing) {
      return {
        success: false,
        message: 'Credential already issued',
        workerId: this.workerId
      };
    }

    // Issue new credential
    const id = uuidv4();
    const issuedAt = new Date().toISOString();

    db.prepare(
      'INSERT INTO credentials (id, credential_data, credential_hash, worker_id, issued_at) VALUES (?, ?, ?, ?, ?)'
    ).run(id, JSON.stringify(credentialData), credentialHash, this.workerId, issuedAt);

    const credential: Credential = {
      id,
      credentialData,
      credentialHash,
      workerId: this.workerId,
      issuedAt
    };

    return {
      success: true,
      credential,
      message: `credential issued by ${this.workerId}`,
      workerId: this.workerId
    };
  }

  /**
   * Get all issued credentials
   */
  public getAllCredentials(): Credential[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM credentials ORDER BY issued_at DESC').all();

    return rows.map((row: any) => ({
      id: row.id,
      credentialData: JSON.parse(row.credential_data),
      credentialHash: row.credential_hash,
      workerId: row.worker_id,
      issuedAt: row.issued_at
    }));
  }
}
