import { Router } from 'express';
import { getFirstSix } from '../controllers/products';

const router = Router()

router.get("/firstSix", getFirstSix)

export default router;