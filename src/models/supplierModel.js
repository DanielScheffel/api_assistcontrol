import 'dotenv/config';
import pool from "../config/database.js";

export async function getSupplierModel() {
    const result = await pool.query("SELECT * FROM fornecedor");

    return result.rows;
}

export async function supplierModel( marca, representante, contato, email, usuarioLogado ) {

    //Verificando se a empresa já existe
    const result = await pool.query("SELECT * FROM fornecedor WHERE marca = $1", [marca]);
    const rows = result.rows;

    if(rows.length > 0) {
        throw new Error("Fornecedor já cadastrado")
    }

    if(usuarioLogado.tipo_usuario === "Funcionario") {
        throw new Error("Funcionários não podem cadastrar fornecedores. Solicite a um gerente ou administrador");
    }

    //Inserindo o fornecedor no banco de dados
    await pool.query(
        `INSERT INTO fornecedor (marca, representante, contato, email) VALUES ($1, $2, $3, $4)`,
        [marca, representante, contato, email]
    )

    return {
        message: "Fornecedor cadastrado com sucesso"
    }

}

export async function updateSupplierModel({ supplierID, marca, representante, contato, email, usuarioLogado }) {

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
        `UPDATE fornecedor SET marca = COALESCE($1, marca),
        representante = COALESCE($2, representante), contato = COALESCE($3, contato), email = COALESCE($4, email)
        WHERE id_fornecedor = $5
        RETURNING id_fornecedor, marca, representante, contato, email`,
        [marca, representante, contato, email, supplierID]
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