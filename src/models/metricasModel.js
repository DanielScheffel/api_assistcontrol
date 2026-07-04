import "dotenv/config";
import pool from "../config/database.js";

// Métrica de total de assistências
export async function getTotalAssistencias() {
    const result = await pool.query("SELECT COUNT(*) AS total FROM assistencia");

    return {
        total: Number(result.rows[0].total)
    };
}

// Métrica por status
export async function getAssistenciasPorStatus() {

    const result = await pool.query(`
        SELECT
            s.status,
            COUNT(*) AS total

        FROM assistencia a

        INNER JOIN status_assistencia s
            ON a.status_assistencia_id = s.id_status_assistencia

        GROUP BY s.status

        ORDER BY total DESC
    `);

    return result.rows;
}

// Métrica por loja
export async function getAssistenciasPorLoja() {

    const result = await pool.query(`
        SELECT
            l.loja_nome,
            COUNT(*) AS total

        FROM assistencia a

        INNER JOIN loja l
            ON a.loja_id = l.id_loja

        GROUP BY l.loja_nome

        ORDER BY total DESC
    `);

    return result.rows.map(item => ({
        loja_nome: item.loja_nome,
        total: Number(item.total)
    }));
}

// Métrica para fornecedores
export async function getAssistenciasPorFornecedor() {

    const result = await pool.query(`
        SELECT
            f.marca,
            COUNT(*) AS total

        FROM assistencia a

        INNER JOIN produto p
            ON a.produto_id = p.id_produto

        INNER JOIN fornecedor f
            ON p.fornecedor_id = f.id_fornecedor

        GROUP BY f.marca

        ORDER BY total DESC
    `);

    return result.rows.map(item => ({
        marca: item.marca,
        total: Number(item.total)
    }));
}

// Métrica para tempo médio
export async function getTempoMedioResolucao() {

    const result = await pool.query(`
        SELECT
            ROUND(
                AVG(
                    EXTRACT(
                        DAY FROM (data_finalizada - data_solicitada)
                    )
                ),
                2
            ) AS media_dias

        FROM assistencia

        WHERE data_finalizada IS NOT NULL
    `);

    return {
        media_dias: Number(result.rows[0].media_dias || 0)
    };
}

// Métrica para valor total
export async function getValorTotalParado() {

    const result = await pool.query(`
        SELECT
            COALESCE(
                ROUND(
                    SUM(p.valor_produto),
                    2
                ),
                0
            ) AS valor_total

        FROM assistencia a

        INNER JOIN produto p
            ON a.produto_id = p.id_produto

        INNER JOIN status_assistencia s
            ON a.status_assistencia_id = s.id_status_assistencia

        WHERE s.status NOT IN ('Concluída', 'Cancelada')
    `);

    return {
        valor_total: Number(result.rows[0].valor_total)
    };
}

// Métrica para assistências atrasadas
export async function getAssistenciasAtrasadas() {
  const result = await pool.query(`
    SELECT
      a.id_assistencia,
      a.codigo_interno,
      a.defeito,
      a.data_solicitada,
      l.loja_nome,
      p.descricao AS produto,
      f.marca AS fornecedor,
      s.status
    FROM assistencia a
    INNER JOIN loja l ON a.loja_id = l.id_loja
    INNER JOIN produto p ON a.produto_id = p.id_produto
    INNER JOIN fornecedor f ON p.fornecedor_id = f.id_fornecedor
    INNER JOIN status_assistencia s ON a.status_assistencia_id = s.id_status_assistencia
    WHERE a.data_finalizada IS NULL
      AND a.data_solicitada < CURRENT_DATE - INTERVAL '15 days'
      AND s.status NOT IN ('Finalizada', 'Cancelada')
    ORDER BY a.data_solicitada ASC
  `);

  return result.rows;
}

export async function getAssistenciasPorMes() {
  const result = await pool.query(`
    SELECT
      TO_CHAR(data_solicitada, 'MM/YYYY') AS mes,
      COUNT(*) AS total
    FROM assistencia
    GROUP BY mes
    ORDER BY MIN(data_solicitada)
  `);

  return result.rows.map(item => ({
    mes: item.mes,
    total: Number(item.total)
  }));
}

export async function getValorPorFornecedor() {
    const result = await pool.query(`
    SELECT
      f.marca,
      COALESCE(ROUND(SUM(p.valor_produto), 2), 0) AS valor_total
    FROM assistencia a
    INNER JOIN produto p
      ON a.produto_id = p.id_produto
    INNER JOIN fornecedor f
      ON p.fornecedor_id = f.id_fornecedor
    INNER JOIN status_assistencia s
      ON a.status_assistencia_id = s.id_status_assistencia
    WHERE s.status NOT IN ('Concluída', 'Cancelada')
    GROUP BY f.marca
    ORDER BY valor_total DESC
  `);

  return result.rows.map(item => ({
    marca: item.marca,
    valor_total: Number(item.valor_total)
  }));
}

export async function getProdutosComMaisAssistencias() {
  const result = await pool.query(`
    SELECT
      p.descricao AS produto,
      COUNT(*) AS total
    FROM assistencia a

    INNER JOIN produto p
      ON a.produto_id = p.id_produto

    GROUP BY p.descricao

    ORDER BY total DESC

    LIMIT 5
  `);

  return result.rows.map(item => ({
    produto: item.produto,
    total: Number(item.total)
  }));
}

export async function getTaxaConclusao() {
  const result = await pool.query(`
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (
        WHERE s.status = 'Finalizada'
      ) AS finalizadas

    FROM assistencia a

    INNER JOIN status_assistencia s
      ON a.status_assistencia_id = s.id_status_assistencia
  `);

  const total = Number(result.rows[0].total);
  const finalizadas = Number(result.rows[0].finalizadas);

  const percentual =
    total === 0 ? 0 : Number(((finalizadas / total) * 100).toFixed(2));

  return {
    total,
    finalizadas,
    percentual
  };
}