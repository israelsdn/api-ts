import { Router, Response, Request } from 'express';
import { registerUser, deleteUser, getUsers, updateUser, getUser } from './controllers/playersControllers';
export const router = Router();

//Rotas de usuarios
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.post('/users/register', registerUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);