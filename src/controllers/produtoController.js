import { getProdutosModel, produtoModel } from "../models/produtoModel.js";


export async function getProdutosController(req, res) {
    try {
        const produtos = await getProdutosModel();

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function produtoController(req, res) {

    try {

        const { nome, sku, valor_produto, cor, id_categoria, id_fornecedor } = req.body;

        const result = await produtoModel(nome, sku, valor_produto, cor, id_categoria, id_fornecedor);

        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }

}