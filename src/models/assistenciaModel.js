import "dotenv/config";
import pool from "../config/database.js";

// Função para obter a lista de assistências
export async function getAssistenciaList() {
  const result = await pool.query("select * from assistencia");

  return result.rows;
}

// Função para criar uma nova assistência
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

  const assistenciaID = result.rows[0].id_assistencia;

  const lojaResult = await pool.query(
    `SELECT sigla FROM loja WHERE id_loja = $1`,
    [loja_id],
  );

  const sigla = lojaResult.rows[0].sigla;

  const codigoInterno = `${sigla}${assistenciaID.toString().padStart(3, "0")}`;

  await pool.query(
    `UPDATE assistencia SET codigo_interno = $1 WHERE id_assistencia = $2`,
    [codigoInterno, assistenciaID],
  );

  return {
    message: "Assistência cadastrada com sucesso",
    id: assistenciaID,
    codigo_interno: codigoInterno,
  };
}

// Função para criar um histórico de status para uma assistência
export async function criarHistoricoStatus(
  assistenciaID,
  status_assistenciaID,
) {
  await pool.query(
    `INSERT INTO historico_status (assistencia_id, status_assistencia_id)
    VALUES ($1, $2)`,
    [assistenciaID, status_assistenciaID],
  );

  return {
    message: "Histórico de assistência criado com sucesso",
    assistenciaID,
    status_assistenciaID,
  };
}

// Função para atualizar o status de uma assistência
export async function updateStatusAssistencia(
  assistenciaID,
  status_assistenciaID,
) {
  const assistencia = await pool.query(
    "SELECT * FROM assistencia WHERE id_assistencia = $1",
    [assistenciaID],
  );

  if (assistencia.rows.length === 0) {
    throw new Error("Assistência não encontrada");
  }

  const status = await pool.query(
    "SELECT * FROM status_assistencia WHERE id_status_assistencia = $1",
    [status_assistenciaID],
  );

  if (status.rows.length === 0) {
    throw new Error("Status de assistência não encontrado");
  }

  let result;

  if (status_assistenciaID == 4 || status_assistenciaID == 5) {

    result = await pool.query(
      `UPDATE assistencia
         SET
            status_assistencia_id = $1,
            data_finalizada = CURRENT_TIMESTAMP
         WHERE id_assistencia = $2`,
      [status_assistenciaID, assistenciaID],
    );

  } else {

    result = await pool.query(
      `UPDATE assistencia
         SET status_assistencia_id = $1
         WHERE id_assistencia = $2`,
      [status_assistenciaID, assistenciaID],
    );
  }

  return result.rows[0];
}

// Função para obter os detalhes de uma assistência por ID
export async function getAssistenciaById(assistenciaID) {
  const result = await pool.query(
    `SELECT
            a.id_assistencia,
            a.codigo_interno,
            a.defeito,
            a.numero_peca,
            a.descricao_peca,
            a.data_solicitada,
            a.data_finalizada,

            l.id_loja,
            l.loja_nome,

            u.id_usuario,
            u.nome AS usuario_nome,

            p.id_produto,
            p.sku,
            p.descricao AS produto_descricao,

            c.categoria,

            f.id_fornecedor,
            f.marca,
            f.representante,
            f.email AS fornecedor_email,

            s.status AS status

        FROM assistencia a

        INNER JOIN loja l
            ON a.loja_id = l.id_loja

        INNER JOIN usuario u
            ON a.usuario_id = u.id_usuario

        INNER JOIN produto p
            ON a.produto_id = p.id_produto

        INNER JOIN categoria_produto c
            ON p.categoria_id = c.id_categoria_produto

        INNER JOIN fornecedor f
            ON p.fornecedor_id = f.id_fornecedor

        INNER JOIN status_assistencia s
            ON a.status_assistencia_id = s.id_status_assistencia

        WHERE a.id_assistencia = $1;`,
    [assistenciaID],
  );

  if (result.rows.length === 0) {
    throw new Error("Assistência não encontrada");
  }

  const imagens = await pool.query(
    `SELECT id_imagem, nome_arquivo, url_arquivo FROM assistencia_imagem WHERE assistencia_id = $1`,
    [assistenciaID],
  );

  return {
    ...result.rows[0],
    imagens: imagens.rows,
  };
}

// Função para buscar assistências com base em filtros
export async function getSearchAssistenciaModel(filtros) {
  let query = `
  SELECT
            a.id_assistencia,
            a.codigo_interno,
            a.data_solicitada,

            l.loja_nome,

            p.descricao AS produto,

            f.marca,

            s.status

        FROM assistencia a

        INNER JOIN loja l
            ON a.loja_id = l.id_loja

        INNER JOIN produto p
            ON a.produto_id = p.id_produto

        INNER JOIN fornecedor f
            ON p.fornecedor_id = f.id_fornecedor

        INNER JOIN status_assistencia s
            ON a.status_assistencia_id = s.id_status_assistencia

        WHERE 1 = 1
    `;

  const values = [];
  let index = 1;

  if (filtros.codigoInterno) {
    query += ` AND a.codigo_interno ILIKE $${index}`;
    values.push(`%${filtros.codigoInterno}%`);
    index++;
  }

  if (filtros.status) {
    query += ` AND s.status ILIKE $${index}`;
    values.push(`%${filtros.status}%`);
    index++;
  }

  if(filtros.loja) {
    query += ` AND l.loja_nome ILIKE $${index}`;
    values.push(`%${filtros.loja}%`);
    index++;
  }

  if(filtros.fornecedor) {
    query += ` AND f.marca ILIKE $${index}`;
    values.push(`%${filtros.fornecedor}%`);
    index++;
  }

  if(filtros.data_inicio && filtros.data_fim) {
    query += ` AND a.data_solicitada BETWEEN $${index} AND $${index + 1}`;
    values.push(filtros.data_inicio, filtros.data_fim);
    index += 2;
  }

  query += ` ORDER BY a.data_solicitada DESC`;

  const result = await pool.query(query, values);

  return result.rows;
}
