import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { CredentialService } from '../services/issuance-serv';
import { credentialSchema } from '../config/types';


const router = Router();
const credentialService = new CredentialService();


/**
 * POST /api/credentials/issue
 * Issue a new credential
 */
router.post('/issue', (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = credentialSchema.parse(req.body);

    // Issue credential
    const result = credentialService.issueCredential(validatedData);

    if (!result.success) {
      return res.status(409).json({
        success: false,
        message: result.message,
        workerId: result.workerId
      });
    }

    res.status(201).json({
      success: true,
      message: result.message,
      credential: result.credential,
      workerId: result.workerId
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credential data',
        errors: error
      });
    }

    console.error('Error issuing credential:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/credentials
 * Get all issued credentials
 */
router.get('/credentials', (req: Request, res: Response) => {
  try {
    const credentials = credentialService.getAllCredentials();
    res.json({
      success: true,
      credentials,
      count: credentials.length
    });
  } catch (error) {
    console.error('Error fetching credentials:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export { router as credentialRouter };
