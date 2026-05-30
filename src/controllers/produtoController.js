import { getProdutosModel, produtoModel, updateProdutoModel, deleteProdutoModel } from "../models/produtoModel.js";


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

        const { sku, descricao, valor_produto, codigo_gtin_ean, categoria_id, fornecedor_id } = req.body;

        const result = await produtoModel(sku, descricao, valor_produto, codigo_gtin_ean, categoria_id, fornecedor_id);

        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }

}

export async function updateProdutoController(req, res) {
    try {
        const { produtoID } = req.params;
        const { sku, descricao, valor_produto, codigo_gtin_ean, categoria_id, fornecedor_id } = req.body;

        const updateProduto = await updateProdutoModel({
            produtoID,
            sku,
            descricao,
            valor_produto,
            codigo_gtin_ean,
            categoria_id,
            fornecedor_id
        })

        return res.status(200).json({
            message: "Produto atualizado com sucesso",
            produto: updateProduto
        })
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);

        return res.status(400).json({
            message: error.message
        })
    }
}

export async function deleteProdutoController(req, res) {

    try {
        const { produtoID } = req.params;

        await deleteProdutoModel(produtoID);

        return res.status(200).json({
            message: "Produto deletado com sucesso"
        })
    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        return res.status(400).json({
            message: error.message
        })
    }
}