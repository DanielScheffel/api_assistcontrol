import { deleteSupplierModel, supplierModel, updateSupplierModel } from "../models/supplierModel.js";


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

export async function updateSupplierController(req, res) {

    try {
        const { supplierID } = req.params;
        const { nome, contato, email, representante } = req.body;
        const usuarioLogado = req.user;

        const updateSupplier = await updateSupplierModel({
            supplierID,
            nome,
            contato,
            email,
            representante,
            usuarioLogado
        })

        return res.status(200).json({
            message: "Fornecedor atualizado com sucesso",
            fornecedor: updateSupplier
        })
    } catch (error) {
        console.error("Erro ao atualizar fornecedor:", error);

        return res.status(400).json({
            message: error.message
        })
    }
}

export async function deleteSupplierController(req, res) {

    const { supplierID } = req.params;

    try {
        const result = await deleteSupplierModel(supplierID, req.user);

        return res.status(200).json({
            message: "Fornecedor deletado com sucesso",
            result
        })
        } catch (error) {
            if(error.message === "Usuário não encontrado") {
                return res.status(404).json({
                    message: error.message
                })
            }

            return res.status(400).json({
                message: error.message
            })
        }
}