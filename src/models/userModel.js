import 'dotenv/config';
import pool from '../config/database.js';
import bcrypt from 'bcrypt';

export async function userModel(nome, email, senha_hash, tipo_usuario) {

    //Verificando se o email já existe
    const result = await pool.query("SELECT * FROM usuario WHERE email = $1", [email]);
    const rows = result.rows;

    if(rows.length > 0 ) {
        throw new Error("Email já cadastrado")
    }

    //Validando o tipo de usuário
    if(!['Administrador', 'Gerente', 'Funcionario'].includes(tipo_usuario)) {
        throw new Error("Tipo de usuário inválido");
    };

    const hashPass = await bcrypt.hash(senha_hash, 10);
    

    //Inserindo o usuário no banco de dados
    await pool.query(
        `INSERT INTO usuario (nome, email, senha_hash, tipo_usuario, status) VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario`,
        [nome, email, hashPass, tipo_usuario, "Ativo"]
    )

    return {
        message: "Usuário cadastrado com sucesso",
        id: result.rows[0].id_usuario
    }
}

export async function updateUserModel({ userID, nome, email, senha_hash, tipo_usuario, usuarioLogado }) {

    // const { nome, email, senha_hash, tipo_usuario } = dados;

    const result = await pool.query(
        "SELECT id_usuario, tipo_usuario FROM usuario WHERE id_usuario = $1",
        [userID]
    )

    if(result.rows.length === 0){
        throw new Error("Usuário não encontrado");
    };

    const userAlvo = result.rows[0];

    // Permissões de atualização
    if(usuarioLogado.tipo_usuario === "Funcionario"){
        throw new Error("Funcionários não podem editar usuários. Solicite a um gerente ou administrador");
    }

    if(
        usuarioLogado.tipo_usuario === "Gerente" &&
        userAlvo.tipo_usuario === "Administrador"
    ){
        throw new Error("Gerentes não podem editar Administradores");
    }

    const update = await pool.query(
        `UPDATE usuario SET nome = COALESCE($1, nome), email = COALESCE($2, email),
        senha_hash = COALESCE($3, senha_hash), tipo_usuario = COALESCE($4, tipo_usuario) WHERE id_usuario = $5
        RETURNING id_usuario, nome, email, tipo_usuario`,
        [nome, email, senha_hash, tipo_usuario, userID]
    )

    return update.rows[0];
}

export async function updateStatusUserModel({ userID, status, usuarioLogado }) {

    if(usuarioLogado.tipo_usuario !== "Administrador"){
        throw new Error("Apenas administradores podem alterar status de usuário");
    }

    if(!["Ativo", "Inativo"].includes(status)) {
        throw new Error("Status inválido");
    }

    const result = await pool.query(
        `UPDATE usuario SET status = $1 WHERE id_usuario = $2
        RETURNING id_usuario, nome, email, tipo_usuario, status`,
        [status, userID]
    )

    if(result.rows.length === 0) {
        throw new Error("Usuário não encontrado");
    }

    return result.rows[0];
}

export async function deleteUserModel(userID, usuarioLogado) {

    const user = await pool.query(
        `SELECT id_usuario, tipo_usuario FROM usuario WHERE id_usuario = $1`,
        [userID]
    )

    if(user.rows.length === 0) {
        throw new Error("Usuário não encontrado");
    }

    if(usuarioLogado.tipo_usuario !== "Gerente" && usuarioLogado.tipo_usuario !== "Administrador") {
        throw new Error("Apenas administradores podem deletar usuários");
    }

    await pool.query(
        `DELETE FROM usuario WHERE id_usuario = $1`,
        [userID]
    )

    return {
        message: "Usuário deletado com sucesso"
    }
}