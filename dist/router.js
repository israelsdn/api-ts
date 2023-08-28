"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const playersControllers_1 = require("./controllers/playersControllers");
exports.router = (0, express_1.Router)();
//Rotas de usuarios
exports.router.get('/users', playersControllers_1.getUsers);
exports.router.get('/users/:id', playersControllers_1.getUser);
exports.router.post('/users/register', playersControllers_1.registerUser);
exports.router.put('/users/:id', playersControllers_1.updateUser);
exports.router.delete('/users/:id', playersControllers_1.deleteUser);
