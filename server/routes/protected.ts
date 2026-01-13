import { Router } from 'express';
import { checkAuth } from '../controllers/protected'
const router = Router();

router.get("/check", checkAuth);


export default router;