import { Router } from 'express';
import { currentUser, login, register } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../middleware/schemas.js';

const router = Router();

router.post('/register', validate('body', registerSchema), register);
router.post('/login', validate('body', loginSchema), login);
router.get('/me', authenticate, currentUser);

export default router;