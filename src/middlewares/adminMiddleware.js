import pool from '../config/database.js';

export async function adminMiddleware(req, res, next) {
    try {

        const user = req.user;

        const result = await pool.query(
            "SELECT tipo_usuario FROM usuario WHERE id_usuario = $1",
            [user.id_usuario]
        )

        const rows = result.rows;

        if(rows.length === 0 || rows[0].tipo_usuario !== "Administrador" && rows[0].tipo_usuario !== "Gerente") {
            return res.status(403).json({
                message: "Acesso negado. Recurso restrito para administradores e gerentes."
            })
        }

        return next();
    } catch(error) {
        return res.status(500).json({
            message: "Erro interno do servidor",
            error: error.message
        });
    }
}