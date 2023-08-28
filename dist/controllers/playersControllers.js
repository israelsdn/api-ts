"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.registerUser = exports.getUser = exports.getUsers = void 0;
const connection_1 = require("../database/connection");
const bcrypt_1 = __importDefault(require("bcrypt"));
const getUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Pegando todos os dados do banco de dados
        const [users] = yield connection_1.connection.query('SELECT * FROM users');
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        //Pegando dados do banco de dados com base no ID informado
        const [user] = yield connection_1.connection.query('SELECT * FROM users WHERE id = ?', [id]);
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.getUser = getUser;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        //Validação dos dados
        const [userExists] = yield connection_1.connection.execute('SELECT * FROM users WHERE email = ?', [user.email]);
        if (!user.nome || !user.email || !user.senha) {
            return res.status(422).json({ msg: 'Dados insuficientes' });
        }
        if (JSON.stringify(userExists) != "[]") {
            return res.status(409).json({ msg: `O email: ${user.email} já está sendo utilizado` });
        }
        //Criptografando a senha
        const salt = yield bcrypt_1.default.genSalt(10);
        const senha_hash = yield bcrypt_1.default.hash(user.senha, salt);
        //Inserindo dados no banco de dados
        const query = `INSERT INTO users (nome, email, senha_hash) VALUES (?, ?, ?)`;
        const [userRegistered] = yield connection_1.connection.query(query, [user.nome, user.email, senha_hash]);
        return res.status(201).json({ msg: `Usuario ${user.nome} criado com sucesso` });
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.registerUser = registerUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = req.body;
        //Criptografando a senha
        const salt = yield bcrypt_1.default.genSalt(10);
        const senha_hash = yield bcrypt_1.default.hash(user.senha, salt);
        //Atualizando dados no banco de dados
        const query = `UPDATE users SET nome = ?, email = ?, senha_hash = ? WHERE id = ?`;
        const [userUpdated] = yield connection_1.connection.query(query, [user.nome, user.email, senha_hash, id]);
        return res.status(200).json({ msg: `Usuario ${user.nome} atualizado com sucesso` });
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        //Deletando dados no banco de dados
        const [userDeleted] = yield connection_1.connection.query('DELETE FROM users WHERE id = ?', [id]);
        return res.status(200).json({ msg: `Usuario ${id} deletado com sucesso` });
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.deleteUser = deleteUser;
