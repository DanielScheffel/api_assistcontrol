import "dotenv/config";
import pool from "../config/database.js";

export async function getRelatorioAssistencias(filtros = {}) {
  let query = `
    SELECT
      a.id_assistencia,
      a.codigo_interno,
      a.defeito,
      a.numero_peca,
      a.descricao_peca,
      a.data_solicitada,
      a.data_finalizada,

      l.id_loja,
      l.loja_nome,

      p.id_produto,
      p.sku,
      p.descricao AS produto_descricao,
      p.valor_produto,

      f.id_fornecedor,
      f.marca AS fornecedor,

      s.id_status_assistencia,
      s.status

    FROM assistencia a
    INNER JOIN loja l ON a.loja_id = l.id_loja
    INNER JOIN produto p ON a.produto_id = p.id_produto
    INNER JOIN fornecedor f ON p.fornecedor_id = f.id_fornecedor
    INNER JOIN status_assistencia s ON a.status_assistencia_id = s.id_status_assistencia

    WHERE 1 = 1
  `;

  const values = [];
  let index = 1;

  if (filtros.loja) {
    query += ` AND l.id_loja = $${index}`;
    values.push(filtros.loja);
    index++;
  }

  if (filtros.fornecedor) {
    query += ` AND f.id_fornecedor = $${index}`;
    values.push(filtros.fornecedor);
    index++;
  }

  if (filtros.status) {
    query += ` AND s.id_status_assistencia = $${index}`;
    values.push(filtros.status);
    index++;
  }

  if (filtros.inicio && filtros.fim) {
    query += ` AND a.data_solicitada::date BETWEEN $${index} AND $${index + 1}`;
    values.push(filtros.inicio, filtros.fim);
    index += 2;
  }

  query += ` ORDER BY a.data_solicitada DESC`;

  const result = await pool.query(query, values);

  return result.rows;
}