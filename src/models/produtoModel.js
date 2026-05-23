import 'dotenv/config';
import pool from '../config/database.js';

export async function getProdutosModel() {
    const result = await pool.query("SELECT id_produto, nome, sku, valor_produto, cor FROM produto");

    return result.rows;
}

export async function produtoModel(nome, sku, valor_produto, cor, id_categoria, id_fornecedor) {

    const result = await pool.query("SELECT * FROM produto WHERE sku = $1", [sku]);
    const rows = result.rows;

    if(rows.length > 0) {
        throw new Error("Produto já cadastrado");
    }

    const insertResult = await pool.query(
        `INSERT INTO produto (nome, sku, valor_produto, cor, categoria_produto_id_categoria_produto, fornecedor_id_fornecedor) VALUES ($1, $2, $3, $4, $5, $6)`,
        [nome, sku, valor_produto, cor, id_categoria, id_fornecedor]
    )

    return {
        message: "Produto cadastrado com sucesso"
    }
} 