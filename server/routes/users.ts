import { Router } from 'express';
import { getUserById, getAllUsers, createUser, signIn, getSavedItems, saveItemInDatabase, deleteSavedItem } from '../controllers/users';

const router = Router()
// GET all users (static path first)
router.get('/getAllUsers', getAllUsers);

// GET user by ID (dynamic path last)
router.post('/getUser', getUserById);

// POST create user
router.post('/create', createUser);

//log in and sign in 
router.post('/signIn', signIn)

router.post('/getSavedItems', getSavedItems)

router.post('/saveItemInDatabase', saveItemInDatabase)

router.post('/removeSavedItem', deleteSavedItem)


export default router;
