import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { VerificationService } from '../services/verifservice';
import { CredentialSchema } from '../lib/types';
const router = Router();
const verificationService = new VerificationService();


/**
 * POST /api/verify
 * Verify a credential
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = CredentialSchema.parse(req.body);

    // Verify credential
    const result = await verificationService.verifyCredential(validatedData);

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        valid: false,
        message: 'Invalid credential data',
        errors: error
      });
    }

    console.error('Error in verification endpoint:', error);
    res.status(500).json({
      valid: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/verify/history
 * Get verification history
 */
router.get('/history', (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const history = verificationService.getVerificationHistory(limit);
    
    res.json({
      success: true,
      history,
      count: history.length
    });
  } catch (error) {
    console.error('Error fetching verification history:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export { router as verificationRouter };
