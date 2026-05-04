import { lojahasUsuarioModel } from "../models/lojahasUsuarioModel.js";
import { lojaModel, updateLojaModel } from "../models/lojaModel.js";


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

export async function updateLojaController(req, res) {
    try {
        const { id_loja} = req.params;
        const { loja_nome, cidade, uf, sigla, cnpj } = req.body;
        const usuarioLogado = req.user;

        await updateLojaModel(
            id_loja,
            loja_nome,
            cidade,
            uf,
            sigla,
            cnpj,
            usuarioLogado
        )

        res.status(200).json({
            message: "Loja atualizada com sucesso"
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}