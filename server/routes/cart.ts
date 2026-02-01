import { Router } from 'express';
import { addToCart, changeCart, createCart, getAllCartItems, getCartInfo, removeCartItem } from '../controllers/cart';
import { saveItemInDatabase } from '../controllers/users';

const router = Router();

router.post("/createCart", createCart)
router.post("/addToCart", addToCart)
router.post("/changeCart", changeCart)
router.post("/removeCartItem", removeCartItem)

router.post("/getAllCartItems", getAllCartItems)
router.post("/getCartInfo", getCartInfo)
router.post("/saveItemInDatabase", saveItemInDatabase)



export default router;