import { Router } from 'express';
import { getUserById, getAllUsers, createUser, signIn } from '../controllers/users';

const router = Router()
// GET all users (static path first)
router.get('/getAllUsers', getAllUsers);

// GET user by ID (dynamic path last)
router.get('/:id', getUserById);

// POST create user
router.post('/create', createUser);

router.post('/signIn', signIn)

export default router;
