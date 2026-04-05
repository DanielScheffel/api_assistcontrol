import 'dotenv/config';
import pool from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function loginModel(email, senha) {

    //Bucando por usuário no banco
    const result = await pool.query("SELECT id_usuario, nome, email, senha_hash, tipo_usuario, status FROM usuario WHERE email = $1", [email]);
    const rows = result.rows;

    if(rows.length === 0) {
        throw new Error("Usuário não encontrado");
    }

    const user = rows[0];
    //Verificando se o usuário está ativo
    if(user.status !== 'Ativo') {
        throw new Error("Usuário inativo");
    }

    //Comparando senha
    const passValid = await bcrypt.compare(senha, user.senha_hash);
    if(!passValid) {
        throw new Error("Senha incorreta");
    };


    // gerando token JWT
    const token = jwt.sign({
        id_usuario: user.id_usuario,
        nome: user.nome,
        email: user.email,
        tipo_usuario: user.tipo_usuario
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN});

    return {
        message: "Login realizado com sucesso!",
        token: token,
    }

}