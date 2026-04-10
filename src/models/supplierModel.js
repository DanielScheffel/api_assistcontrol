import 'dotenv/config';
import pool from "../config/database.js";

export async function supplierModel( nome, contato, email, representante, usuarioLogado ) {

    //Verificando se a empresa já existe
    const result = await pool.query("SELECT * FROM fornecedor WHERE nome = $1", [nome]);
    const rows = result.rows;

    if(rows.length > 0) {
        throw new Error("Fornecedor já cadastrado")
    }

    if(usuarioLogado.tipo_usuario === "Funcionario") {
        throw new Error("Funcionários não podem cadastrar fornecedores. Solicite a um gerente ou administrador");
    }

    //Inserindo o fornecedor no banco de dados
    await pool.query(
        `INSERT INTO fornecedor (nome, contato, email, representante) VALUES ($1, $2, $3, $4)`,
        [nome, contato, email, representante]
    )

    return {
        message: "Fornecedor cadastrado com sucesso"
    }

}