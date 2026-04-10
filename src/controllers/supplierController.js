import { supplierModel } from "../models/supplierModel.js";


export async function supplierController(req, res) {

    const { nome, contato, email, representante } = req.body;
    const usuarioLogado = req.user;

    const result = await supplierModel(
        nome,
        contato,
        email,
        representante,
        usuarioLogado
    )

    return res.status(201).json({
        message: "Fornecedor cadastrado com sucesso",
        fornecedor: result
    })

}