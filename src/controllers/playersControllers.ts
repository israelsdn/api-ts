import { connection } from "../database/connection";
import { Response, Request } from "express";
import { IUser } from "../models/userModels";
import bcrypt from "bcrypt";


export const getUsers = async (_req: Request, res: Response) => {
    try {
        
        //Pegando todos os dados do banco de dados
        const [users] = await connection.query('SELECT * FROM users');

        return res.status(200).json(users);

    } catch (error) {
        return res.status(500).json(error);
    }   
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        
        //Pegando dados do banco de dados com base no ID informado
        const [user] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
        
        return res.status(200).json(user);   
    
    } catch (error) {
        return res.status(500).json(error);
    }   
}

export const registerUser = async (req: Request, res: Response) => {
    try {
        const user: IUser = req.body;

        //Validação dos dados
        const [userExists] = await connection.execute('SELECT * FROM users WHERE email = ?', [user.email]);

        if(!user.nome || !user.email || !user.senha){
            return res.status(422).json({msg: 'Dados insuficientes'});
        }

        if(JSON.stringify(userExists) != "[]"){
            return res.status(409).json({msg: `O email: ${user.email} já está sendo utilizado`});
        }
        
        //Criptografando a senha
        const salt = await bcrypt.genSalt(10);
        const senha_hash = await bcrypt.hash(user.senha, salt);

        //Inserindo dados no banco de dados
        const query = `INSERT INTO users (nome, email, senha_hash) VALUES (?, ?, ?)`;
        const [userRegistered] = await connection.query(query, [user.nome, user.email, senha_hash]);

        return res.status(201).json({msg: `Usuario ${user.nome} criado com sucesso`});   
    
    } catch (error) {
        return res.status(500).json(error);
    }   
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const user: IUser = req.body;

        //Criptografando a senha
        const salt = await bcrypt.genSalt(10);
        const senha_hash = await bcrypt.hash(user.senha, salt);

        //Atualizando dados no banco de dados
        const query = `UPDATE users SET nome = ?, email = ?, senha_hash = ? WHERE id = ?`;
        const [userUpdated] = await connection.query(query, [user.nome, user.email, senha_hash, id]);

        return res.status(200).json({msg: `Usuario ${user.nome} atualizado com sucesso`});   

    } catch (error) {
        return res.status(500).json(error);
    }   
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        //Deletando dados no banco de dados
        const [userDeleted] = await connection.query('DELETE FROM users WHERE id = ?', [id]);

        return res.status(200).json({msg: `Usuario ${id} deletado com sucesso`});   

    } catch (error) {
        return res.status(500).json(error);
    }   
}