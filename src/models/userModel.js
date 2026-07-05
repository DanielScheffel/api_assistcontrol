import "dotenv/config";
import pool from "../config/database.js";
import bcrypt from "bcrypt";

export async function getUsersModel() {
  const result = await pool.query(
    "SELECT id_usuario, nome, email, tipo_usuario, status FROM usuario",
  );

  return result.rows;
}

export async function getUserById(id) {
  const result = await pool.query(
    `
        SELECT
            id_usuario,
            nome,
            email,
            tipo_usuario,
            status
        FROM usuario
        WHERE id_usuario = $1
        `,
    [id],
  );

  if (result.rows.length === 0) {
    throw new Error("Usuário não encontrado");
  }

  return result.rows[0];
}

export async function userModel(nome, email, senha_hash, tipo_usuario, usuarioLogado) {
  //Verificando se o email já existe
  const result = await pool.query("SELECT * FROM usuario WHERE email = $1", [
    email,
  ]);
  const rows = result.rows;

  if (rows.length > 0) {
    throw new Error("Email já cadastrado");
  }

  if (
    tipo_usuario === "Administrador" &&
    usuarioLogado.tipo_usuario !== "Administrador"
) {
    throw new Error("Somente administradores podem criar outro administrador");
}

  const hashPass = await bcrypt.hash(senha_hash, 10);

  //Inserindo o usuário no banco de dados
  const insertResult = await pool.query(
    `INSERT INTO usuario (nome, email, senha_hash, tipo_usuario, status) VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario`,
    [nome, email, hashPass, tipo_usuario, "Ativo"],
  );

  return {
    message: "Usuário cadastrado com sucesso",
    id: insertResult.rows[0].id_usuario,
  };
}

export async function updateUserModel({
  userID,
  nome,
  email,
  senha_hash,
  tipo_usuario,
  usuarioLogado,
}) {
  // buscar usuário alvo
  const usuarioAlvo = await pool.query(
    `SELECT id_usuario, tipo_usuario, status
   FROM usuario
   WHERE id_usuario = $1`,
    [userID],
  );

  if (usuarioAlvo.rows.length === 0) {
    throw new Error("Usuário não encontrado");
  }

  const alvo = usuarioAlvo.rows[0];

  // gerente não altera administrador
  if (
    alvo.tipo_usuario === "Administrador" &&
    usuarioLogado.tipo_usuario === "Gerente"
  ) {
    throw new Error("Gerente não pode alterar administrador");
  }

  // somente admin altera tipo_usuario
  if (tipo_usuario && usuarioLogado.tipo_usuario !== "Administrador") {
    throw new Error(
      "Somente administradores podem alterar o perfil de usuários",
    );
  }

  // ninguém altera o próprio tipo
  if (Number(usuarioLogado.id_usuario) === Number(userID) && tipo_usuario) {
    throw new Error("Você não pode alterar o próprio perfil");
  }

  let senhaAtualizada = senha_hash;

  if (senha_hash) {
    senhaAtualizada = await bcrypt.hash(senha_hash, 10);
  }

  const update = await pool.query(
    `UPDATE usuario SET nome = COALESCE($1, nome), email = COALESCE($2, email),
        senha_hash = COALESCE($3, senha_hash), tipo_usuario = COALESCE($4, tipo_usuario) WHERE id_usuario = $5
        RETURNING id_usuario, nome, email, tipo_usuario`,
    [nome, email, senhaAtualizada, tipo_usuario, userID],
  );

  return update.rows[0];
}

export async function updateStatusUserModel({ userID, status, usuarioLogado }) {
  if (!["Ativo", "Inativo"].includes(status)) {
    throw new Error("Status inválido");
  }

  const usuarioAlvo = await pool.query(
    `SELECT id_usuario, tipo_usuario, status
     FROM usuario
     WHERE id_usuario = $1`,
    [userID],
  );

  if (usuarioAlvo.rows.length === 0) {
    throw new Error("Usuário não encontrado");
  }

  const alvo = usuarioAlvo.rows[0];

  if (
    alvo.tipo_usuario === "Administrador" &&
    usuarioLogado.tipo_usuario === "Gerente"
  ) {
    throw new Error("Gerente não pode inativar administrador");
  }

  if (alvo.tipo_usuario === "Administrador" && status === "Inativo") {
    const admins = await pool.query(`
      SELECT COUNT(*) AS total
      FROM usuario
      WHERE tipo_usuario = 'Administrador'
      AND status = 'Ativo'
    `);

    if (Number(admins.rows[0].total) <= 1) {
      throw new Error("Não é possível inativar o único administrador ativo");
    }
  }

  const result = await pool.query(
    `UPDATE usuario SET status = $1 WHERE id_usuario = $2
        RETURNING id_usuario, nome, email, tipo_usuario, status`,
    [status, userID],
  );

  if (result.rows.length === 0) {
    throw new Error("Usuário não encontrado");
  }

  return result.rows[0];
}

export async function deleteUserModel(userID, usuarioLogado) {
  const user = await pool.query(
    `SELECT id_usuario, tipo_usuario FROM usuario WHERE id_usuario = $1`,
    [userID]
  );

  if (user.rows.length === 0) {
    throw new Error("Usuário não encontrado");
  }

  const alvo = user.rows[0];

  if (Number(usuarioLogado.id_usuario) === Number(userID)) {
    throw new Error("Você não pode excluir seu próprio usuário");
  }

  if (
    alvo.tipo_usuario === "Administrador" &&
    usuarioLogado.tipo_usuario === "Gerente"
  ) {
    throw new Error("Gerente não pode excluir administrador");
  }

  if (alvo.tipo_usuario === "Administrador") {
    const admins = await pool.query(`
      SELECT COUNT(*) AS total
      FROM usuario
      WHERE tipo_usuario = 'Administrador'
      AND status = 'Ativo'
    `);

    if (Number(admins.rows[0].total) <= 1) {
      throw new Error("Não é possível excluir o único administrador ativo");
    }
  }

  await pool.query(
    `DELETE FROM usuario WHERE id_usuario = $1`,
    [userID]
  );

  return {
    message: "Usuário deletado com sucesso"
  };
}