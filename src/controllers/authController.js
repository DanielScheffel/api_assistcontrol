import { loginModel } from "../models/authModel.js";


export async function loginController(req, res) {

    try {
        const { email, senha } = req.body;

        const result = await loginModel(email, senha);

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        if(error.message === "Usuário não encontrado" || error.message === "Senha incorreta") {
            return res.status(403).json({
                message: error.message
            })
        }

        return res.status(500).json({
            message: "Erro interno do servidor"
        })
    }

}