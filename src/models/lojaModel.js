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