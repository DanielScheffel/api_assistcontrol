import 'dotenv/config';
import pool from '../config/database.js';

export async function getProdutosModel() {
    const result = await pool.query("SELECT id_produto, nome, sku, valor_produto, cor FROM produto");

    return result.rows;
}

export async function produtoModel(nome, sku, valor_produto, cor, categoria_id, fornecedor_id) {

    const result = await pool.query("SELECT * FROM produto WHERE sku = $1", [sku]);
    const rows = result.rows;

    if(rows.length > 0) {
        throw new Error("Produto já cadastrado");
    }

    const categoria = await pool.query("SELECT * FROM categoria_produto WHERE id_categoria_produto = $1", [categoria_id]);

    if(categoria.rows.length === 0) {
        throw new Error("Categoria não encontrada");
    }

    const fornecedor = await pool.query("SELECT * FROM fornecedor WHERE id_fornecedor = $1", [fornecedor_id]);

    if(fornecedor.rows.length ===0) {
        throw new Error("Fornecedor não encontrado");
    }


    const insertResult = await pool.query(
        `INSERT INTO produto (nome, sku, valor_produto, cor, categoria_id, fornecedor_id) VALUES ($1, $2, $3, $4, $5, $6)`,
        [nome, sku, valor_produto, cor, categoria_id, fornecedor_id]
    )

    return {
        message: "Produto cadastrado com sucesso"
    }
}

export async function updateProdutoModel({ produtoID, nome, sku, valor_produto, cor, categoria_id, fornecedor_id }) {

    const result = await pool.query("SELECT id_produto FROM produto WHERE id_produto = $1", [produtoID]);

    if(result.rows.length === 0) {
        throw new Error("Produto não encontrado");
    }

    const update = await pool.query(
        `UPDATE produto SET nome = COALESCE($1, nome), sku = COALESCE($2, sku),
        valor_produto = COALESCE($3, valor_produto), cor = COALESCE($4, cor),
        categoria_id = COALESCE($5, categoria_id), fornecedor_id = COALESCE($6, fornecedor_id) WHERE id_produto = $7
        RETURNING id_produto, nome, sku, valor_produto, cor, categoria_id, fornecedor_id`,
        [nome, sku, valor_produto, cor, categoria_id, fornecedor_id, produtoID]
    )

    return update.rows[0];

}

export async function deleteProdutoModel(produtoID) {

    const result = await pool.query("SELECT id_produto FROM produto WHERE id_produto = $1", [produtoID]);

    if(result.rows.length === 0) {
        throw new Error("Produto não encontrado");
    }

    await pool.query("DELETE FROM produto WHERE id_produto = $1", [produtoID]);

    return {
        message: "Produto deletado com sucesso"
    }
}