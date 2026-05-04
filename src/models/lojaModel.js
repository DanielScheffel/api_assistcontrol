import 'dotenv/config';
import pool from '../config/database.js';

export async function lojaModel( loja_nome, cidade, uf, sigla, cnpj, usuarioLogado ) {

    // Verificando se a loja já existe
    const result = await pool.query("SELECT * FROM loja WHERE cnpj = $1", [cnpj]);
    const rows = result.rows;

    if(rows.length > 0) {
        throw new Error("Loja já cadastrada");
    };

    if(usuarioLogado.tipo_usuario === "Funcionario") {
        throw new Error("Funcionários não podem cadastrar lojas. Solicite a um gerente ou administrador");
    }

    // Inserindo a loja no banco de dados
    const resultInsert = await pool.query(
        `INSERT INTO loja (loja_nome, cidade, uf, sigla, cnpj)
        VALUES ($1, $2, $3, $4, $5) RETURNING id_loja`,
        [loja_nome, cidade, uf, sigla, cnpj]
    )

    return {
        message: "Loja cadastrada com sucesso",
        id: resultInsert.rows[0].id_loja
    }
}

export async function updateLojaModel( id_loja, loja_nome, cidade, uf, sigla, cnpj, usuarioLogado ) {

    const result = await pool.query(
        "SELECT id_loja FROM loja WHERE id_loja = $1",
        [id_loja]
    )

    if(result.rows.length === 0) {
        throw new Error("Loja não encontrada");
    }

    if(usuarioLogado.tipo_usuario === "Funcionario") {
        throw new Error("Funcionários não podem editar lojas. Solicite a um gerente ou administrador");
    }

    await pool.query(
        `UPDATE loja SET loja_nome = COALESCE($1, loja_nome),
        cidade = COALESCE($2, cidade), uf = COALESCE($3, uf),
        sigla = COALESCE($4, sigla), cnpj = COALESCE($5, cnpj)
        WHERE id_loja = $6`,
        [loja_nome, cidade, uf, sigla, cnpj, id_loja]
    )

    return { 
        message: "Loja atualizada com sucesso"
    }
}