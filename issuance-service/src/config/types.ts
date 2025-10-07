import { z } from 'zod';

export const credentialSchema = z.object({
    holderName: z.string().min(1).max(255),
    credentialType: z.string().min(1).max(100),
    issueDate: z.string().optional(),
    expiryDate: z.string().optional(),
    data: z.string().optional()
  });
  
