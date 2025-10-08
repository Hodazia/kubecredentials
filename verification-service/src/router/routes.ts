import { Router, Request, Response } from 'express';
import os from 'os';
import crypto from 'crypto';
// import jwt from 'jsonwebtoken';
import { getDatabase } from '../lib/db';
import { CredentialSchema } from '../lib/types';

const router = Router();

const getWorkerId = () => process.env.HOSTNAME || os.hostname();

function stringifyDeterministic(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(v => stringifyDeterministic(v)).join(',')}]`;
  const entries = Object.entries(value as Record<string, unknown>).sort(([a],[b]) => a.localeCompare(b));
  return `{${entries.map(([k,v]) => `${JSON.stringify(k)}:${stringifyDeterministic(v)}`).join(',')}}`;
}

interface VerificationResult {
  valid: boolean;
  message: string;
  workerId: string;
  timestamp: string;
  credentialDetails?: { id: string; issuedBy: string; issuedAt: string };
}

class VerificationService {
  private workerId: string;
  private issuanceServiceUrl: string;

  constructor() {
    this.workerId = process.env.HOSTNAME || os.hostname();
    this.issuanceServiceUrl = process.env.ISSUANCE_SERVICE_URL || 'http://localhost:3000';
  }

  private generateCredentialHash(credential: any): string {
    const normalizedData = JSON.stringify(credential, Object.keys(credential).sort());
    return crypto.createHash('sha256').update(normalizedData).digest('hex');
  }

  public async verifyCredential(credentialData: any): Promise<VerificationResult> {
    const db = getDatabase();
    const credentialHash = this.generateCredentialHash(credentialData);
    console.log("The credential Hash is ", credentialHash);
    const timestamp = new Date().toISOString();

    try {
      const resp = await fetch(`${this.issuanceServiceUrl}/credentials`);
      if (!resp.ok) throw new Error(`upstream ${resp.status}`);
      const data = await resp.json();
      const issuedCredentials = (data && data.credentials) || [];

      const matchingCredential = issuedCredentials.find((cred: any) => cred.credentialHash === credentialHash);
      const verified = !!matchingCredential;
      console.log("Verified is ", verified);

      db.prepare('INSERT INTO verification_logs (credential_hash, verified, worker_id, verified_at, credential_data) VALUES (?, ?, ?, ?, ?)')
        .run(credentialHash, verified, this.workerId, timestamp, JSON.stringify(credentialData));

      if (verified) {
        return {
          valid: true,
          message: `verified by ${this.workerId}`,
          workerId: this.workerId,
          timestamp,
          credentialDetails: {
            id: matchingCredential.id,
            issuedBy: matchingCredential.workerId,
            issuedAt: matchingCredential.issuedAt,
          },
        };
      } else {
        return {
          valid: false,
          message: `credential not found - verified by ${this.workerId}`,
          workerId: this.workerId,
          timestamp,
        };
      }
    } catch (error) {
      db.prepare('INSERT INTO verification_logs (credential_hash, verified, worker_id, verified_at, credential_data) VALUES (?, ?, ?, ?, ?)')
        .run(credentialHash, false, this.workerId, timestamp, JSON.stringify(credentialData));

      return {
        valid: false,
        message: `verification failed - checked by ${this.workerId}`,
        workerId: this.workerId,
        timestamp,
      };
    }
  }

  public getVerificationHistory(limit: number = 100): any[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM verification_logs ORDER BY verified_at DESC LIMIT ?').all(limit);
    return rows.map((row: any) => ({
      id: row.id,
      credentialHash: row.credential_hash,
      verified: row.verified === 1,
      workerId: row.worker_id,
      verifiedAt: row.verified_at,
      credentialData: JSON.parse(row.credential_data),
    }));
  }
}

const service = new VerificationService();

router.post('/verify', async (req: Request, res: Response) => {
  try {
    console.log("the credential data is ", req.body);

    const parsed = CredentialSchema.safeParse(req.body);
    console.log("what is the parsed data ", parsed);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: 'Invalid credential payload', issues: parsed.error.flatten() });
    }
    const result = await service.verifyCredential(parsed.data);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/verify/history', (req: Request, res: Response) => {
  const limit = Number(req.query.limit || 100);
  const rows = service.getVerificationHistory(Number.isFinite(limit) ? limit : 100);
  res.json({ items: rows });
});

export default router;


