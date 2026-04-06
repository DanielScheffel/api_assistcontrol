import { userModel } from "../models/userModel.js";


export async function userController(req, res) {
    
    const { nome, email, senha, tipo_usuario } = req.body;

    const result = await userModel(nome, email, senha, tipo_usuario);

    return res.status(201).json(result);
}