import "dotenv/config";
import pool from "../config/database.js";

export async function getAssistenciaList() {
  const result = await pool.query("select * from assistencia");

  return result.rows;
}

export async function assistenciaModel(
  defeito,
  numero_peca,
  descricao_peca,
  loja_id,
  usuario_id,
  produto_id,
  status_assistencia_id,
) {
  const loja = await pool.query("SELECT * from  loja WHERE id_loja = $1", [
    loja_id,
  ]);

  if (loja.rows.length === 0) {
    throw new Error("Loja não encontrada");
  }

  const produto = await pool.query(
    "SELECT * from  produto WHERE id_produto = $1",
    [produto_id],
  );

  if (produto.rows.length === 0) {
    throw new Error("Produto não encontrado");
  }

  const result = await pool.query(
    `INSERT INTO assistencia (defeito, numero_peca, descricao_peca, loja_id, usuario_id, produto_id, status_assistencia_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_assistencia`,
    [
      defeito,
      numero_peca,
      descricao_peca,
      loja_id,
      usuario_id,
      produto_id,
      status_assistencia_id,
    ],
  );

  return {
    message: "Assistência cadastrada com sucesso",
    id: result.rows[0].id_assistencia,
  };
}
