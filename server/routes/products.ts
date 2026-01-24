import { Router } from 'express';
import { getAllProducts, getTenProducts } from '../controllers/products';

const router = Router()

router.get("/getAllProducts", getAllProducts)
router.get("/getTenProducts", getTenProducts)

export default router;