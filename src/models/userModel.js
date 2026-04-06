import 'dotenv/config';
import pool from '../config/database.js';
import bcrypt, { hash } from 'bcrypt';

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
        `INSERT INTO usuario (nome, email, senha_hash, tipo_usuario, status) VALUES ($1, $2, $3, $4, $5)`,
        [nome, email, hashPass, tipo_usuario, "Ativo"]
    )

    return {
        message: "Usuário cadastrado com sucesso"
    }
}