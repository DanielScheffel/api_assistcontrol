import { deleteUserModel, updateStatusUserModel, updateUserModel, userModel } from "../models/userModel.js";


export async function userController(req, res) {
    
    const { nome, email, senha, tipo_usuario } = req.body;

    const result = await userModel(nome, email, senha, tipo_usuario);

    return res.status(201).json(result);
}

export async function updateUserController(req, res) {
    try {
        const { userID } = req.params;
        const { nome, email, senha, tipo_usuario } = req.body;
        const usuarioLogado = req.user;

        const updateUser = await updateUserModel({
            userID,
            nome,
            email,
            senha,
            tipo_usuario,
            usuarioLogado
        })

        // console.log(req.body);
        // console.log("ID: ", userID);

        return res.status(200).json({
            message: "Usuário atualizado com sucesso",
            user: updateUser
        })
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);

        return res.status(400).json({
            message: error.message
        })
    }
}

export async function updateStatusUserController(req, res) {
    
    try {
        const { userID } = req.params;
        const { status } = req.body;
        const usuarioLogado = req.user;

        const usuario = await updateStatusUserModel({
            userID,
            status,
            usuarioLogado
        })

        return res.status(200).json({
            message: "Status do usuário "+userID+" atualizado com sucesso!!",
            usuario
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export async function deleteUserController(req, res) {

    const { userID } = req.params;

    try {
        const result = await deleteUserModel(userID, req.user);

        return res.status(200).json(result);
    } catch (error) {
        if(error.message === "Usuário não encontrado") {
            return res.status(404).json({
                message: error.message
            })
        }

        return res.status(500).json({
            message: error.message
        })
    }
}