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

export async function updateSupplierModel({ supplierID, nome, contato, email, representante, usuarioLogado }) {

    const result = await pool.query(
        "SELECT id_fornecedor FROM fornecedor WHERE id_fornecedor = $1",
        [supplierID]
    )

    if(result.rows.length === 0) {
        throw new Error("Fornecedor não encontrado");
    }

    if(usuarioLogado.tipo_usuario === "Funcionario") {
        throw new Error("Funcionários não podem editar fornecedores. Solicite a um gerente ou administrador");
    }

    const update = await pool.query(
        `UPDATE fornecedor SET nome = COALESCE($1, nome),
        contato = COALESCE($2, contato), email = COALESCE($3, email),
        representante = COALESCE($4, representante) WHERE id_fornecedor = $5
        RETURNING id_fornecedor, nome, contato, email, representante`,
        [nome, contato, email, representante, supplierID]
    )

    return update.rows[0];
}

export async function deleteSupplierModel(supplierID, usuarioLogado) {

    const supplier = await pool.query(
        "SELECT id_fornecedor FROM fornecedor WHERE id_fornecedor = $1",
        [supplierID]
    )

    if(supplier.rows.length === 0) {
        throw new Error("Fornecedor não encontrado");
    }

    if(usuarioLogado.tipo_usuario === "Funcionario") {
        throw new Error("Funcionários não podem deletar fornecedores. Solicite a um gerente ou administrador");
    }

    await pool.query(
        "DELETE FROM fornecedor WHERE id_fornecedor = $1",
        [supplierID]
    )

    return {
        message: "Fornecedor deletado com sucesso"
    }
}