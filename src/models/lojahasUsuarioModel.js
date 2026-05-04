import 'dotenv/config';
import pool from '../config/database.js';

export async function lojahasUsuarioModel( userID, lojaID, usuarioLogado ) {

    if(usuarioLogado.tipo_usuario === "Funcionario") {
        throw new Error("Funcionários não podem associar lojas a usuários. Solicite a um gerente ou administrador");
    }

    const result = await pool.query(
        `SELECT * FROM usuario_has_loja
        WHERE usuario_id_usuario = $1 AND loja_id_loja = $2`,
        [userID, lojaID]
    )

    if(result.rows.length > 0) {
        throw new Error("Usuário já associado a essa loja");
    }

    await pool.query(
        `INSERT INTO usuario_has_loja (usuario_id_usuario, loja_id_loja)
        VALUES ($1, $2)`,
        [userID, lojaID]
    )

    return {
        message: "Loja associada ao usuário com sucesso"
    };
}