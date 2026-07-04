import 'dotenv/config';
import pool from '../config/database.js';

export async function getProdutosModel() {
    const result = await pool.query(`
        SELECT
            p.id_produto,
            p.sku,
            p.descricao,
            p.valor_produto,
            p.codigo_gtin_ean,

            c.id_categoria_produto,
            c.categoria,

            f.id_fornecedor,
            f.marca,
            f.representante

        FROM produto p

        INNER JOIN categoria_produto c
            ON p.categoria_id = c.id_categoria_produto

        INNER JOIN fornecedor f
            ON p.fornecedor_id = f.id_fornecedor

        ORDER BY p.descricao;
    `);

    return result.rows;
}

export async function produtoModel( sku, descricao, valor_produto, codigo_gtin_ean, categoria_id, fornecedor_id) {

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
        `INSERT INTO produto (sku, descricao, valor_produto, codigo_gtin_ean, categoria_id, fornecedor_id) VALUES ($1, $2, $3, $4, $5, $6)`,
        [sku, descricao, valor_produto, codigo_gtin_ean, categoria_id, fornecedor_id]
    )

    return {
        message: "Produto cadastrado com sucesso"
    }
}

export async function updateProdutoModel({ produtoID, sku, descricao, valor_produto, codigo_gtin_ean, categoria_id, fornecedor_id }) {

    const result = await pool.query("SELECT id_produto FROM produto WHERE id_produto = $1", [produtoID]);

    if(result.rows.length === 0) {
        throw new Error("Produto não encontrado");
    }

    const update = await pool.query(
        `UPDATE produto SET sku = COALESCE($1, sku),
        descricao = COALESCE($2, descricao), valor_produto = COALESCE($3, valor_produto), codigo_gtin_ean = COALESCE($4, codigo_gtin_ean),
        categoria_id = COALESCE($5, categoria_id), fornecedor_id = COALESCE($6, fornecedor_id) WHERE id_produto = $7
        RETURNING id_produto, sku, descricao, valor_produto, codigo_gtin_ean, categoria_id, fornecedor_id`,
        [sku, descricao, valor_produto, codigo_gtin_ean, categoria_id, fornecedor_id, produtoID]
    )

    return update.rows[0];

}

export async function deleteProdutoModel(produtoID) {

const assistencias = await pool.query(
    `SELECT id_assistencia 
     FROM assistencia 
     WHERE produto_id = $1`,
    [produtoID]
  );

  if (assistencias.rows.length > 0) {
    throw new Error(
      "Não é possível excluir este produto, pois ele possui assistências cadastradas."
    );
  }

  await pool.query(
    `DELETE FROM produto 
     WHERE id_produto = $1`,
    [produtoID]
  );

  return {
    message: "Produto deletado com sucesso"
  };
}