import 'dotenv/config';
import pool from '../config/database.js';

// export async function getAssistenciaModel() {
//     const result = await pool.query("SELECT loja_id, ")
// }

export async function assistenciaModel(defeito, img_url, img_nome, numero_peca, descricao_peca, loja_id, usuario_id, produto_id, status_assistencia_id) {
    const loja = await pool.query("SELECT * FROM loja WHERE id_loja = $1", [loja_id]);

    if(loja.rows.length === 0) {
        throw new Error("Loja não encontrada");
    }

    const produto = await pool.query("SELECT * FROM produto WHERE id_produto = $1", [produto_id]);

    if(produto.rows.length === 0) {
        throw new Error("Produto não encontrado");
    }

    const status = await pool.query("SELECT * FROM status_assistencia WHERE id_status_assistencia = $1", [status_assistencia_id]);

    if(status.rows.length === 0) {
        throw new Error("Status de assistência não encontrado");
    }

    const result = await pool.query(
        `INSERT INTO assistencia (defeito, img_url, img_nome, numero_peca, descricao_peca, loja_id, usuario_id, produto_id, status_assistencia_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_assistencia`,
        [defeito, img_url, img_nome, numero_peca, descricao_peca, loja_id, usuario_id, produto_id, status_assistencia_id]
    )

    return {
        message: "Assistência cadastrada com sucesso",
        id: result.rows[0].id_assistencia
    }
}