import { Router } from 'express';
import { getAllProducts, getProductBYId, getProductVariantById, getTenProducts } from '../controllers/products';

const router = Router()

router.get("/getAllProducts", getAllProducts)
router.get("/getTenProducts", getTenProducts)
router.post("/getProductBYId", getProductBYId)
router.post("/getProductVariantById", getProductVariantById)


export default router;