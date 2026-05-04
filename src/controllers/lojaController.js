import { lojahasUsuarioModel } from "../models/lojahasUsuarioModel.js";
import { lojaModel } from "../models/lojaModel.js";


export async function lojaController(req, res) {
    try {
        const { loja_nome, cidade, uf, sigla, cnpj } = req.body;
        const usuarioLogado = req.user;

        const userID = usuarioLogado.id_usuario;

        const result = await lojaModel(
            loja_nome,
            cidade,
            uf,
            sigla,
            cnpj,
            usuarioLogado
        );

        console.log("ANTES DE ASSOCIAR A LOJA AO USUÁRIO", result);
        
        await lojahasUsuarioModel(
            userID,
            result.id,
            usuarioLogado
        );

        res.status(201).json({
            message: "Loja cadastrada e associada ao usuário com sucesso",
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}