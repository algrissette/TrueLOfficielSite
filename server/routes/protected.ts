import { Router } from 'express';
import { checkAuth, logout } from '../controllers/protected'
const router = Router();

router.post("/check", checkAuth);
router.post("/logout", logout);



export default router;