import { Router } from 'express';
import { addToCart, changeCart, createCart, getAllCartItems } from '../controllers/cart';

const router = Router();

router.post("/createCart", createCart)
router.post("/addToCart", addToCart)
router.post("/changeCart", changeCart)
router.post("/getAllCartItems", getAllCartItems)



export default router;