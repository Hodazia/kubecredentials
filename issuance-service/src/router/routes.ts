import {Router, Request, Response } from  "express";
import { credentialSchema } from "../config/types";
import os from "os";
import { getDatabase } from "../Database/db";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const router =  Router();

/*
Issues a credential:
- Validates input with Zod
- Generates a stable hash of the credential JSON (SHA-256)
- Stores the credential if new, or returns already_issued if hash exists
- Signs and returns a JWT including hash, worker id, and issued_at
*/

const getWorkerId = () => process.env.HOSTNAME || os.hostname();

// Utility to deterministically stringify objects with sorted keys
function stringifyDeterministic(value: unknown): string {
    if (value === null || typeof value !== 'object') return JSON.stringify(value);
    if (Array.isArray(value)) return `[${value.map(v => stringifyDeterministic(v)).join(',')}]`;
    const entries = Object.entries(value as Record<string, unknown>).sort(([a],[b]) => a.localeCompare(b));
    return `{${entries.map(([k,v]) => `${JSON.stringify(k)}:${stringifyDeterministic(v)}`).join(',')}}`;
}

router.post("/issue", (req: Request, res: Response) => {
    try {
        const parsed = credentialSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid credential payload",
                issues: parsed.error.flatten()
            });
        }

        const credential = parsed.data;
        const workerId = getWorkerId();
        const db = getDatabase();

        const serialized = stringifyDeterministic(credential);
        const credentialHash = crypto.createHash('sha256').update(serialized).digest('hex');

        // Check if already issued
        const select = db.prepare("SELECT id, worker_id, issued_at FROM credentials WHERE credential_hash = ?");
        const existing = select.get(credentialHash) as { id: string; worker_id: string; issued_at: string } | undefined;
        if (existing) {
            return res.status(200).json({
                status: 'already_issued',
                id: existing.id,
                worker_id: existing.worker_id,
                issued_at: existing.issued_at
            });
        }

        const id = crypto.randomUUID();
        const insert = db.prepare("INSERT INTO credentials (id, credential_data, credential_hash, worker_id) VALUES (?, ?, ?, ?)");
        insert.run(id, serialized, credentialHash, workerId);

        const issuedAtRow = db.prepare("SELECT issued_at FROM credentials WHERE id = ?").get(id) as { issued_at: string };
        const issuedAt = issuedAtRow?.issued_at ?? new Date().toISOString();

        const token = jwt.sign(
            { id, credentialHash, worker_id: workerId, issued_at: issuedAt },
            process.env.JWT_SECRET || 'dev-secret',
            { algorithm: 'HS256' }
        );

        return res.status(201).json({
            status: 'issued',
            id,
            message: `credential issued by ${workerId}`,
            worker_id: workerId,
            issued_at: issuedAt,
            token
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

export default router;