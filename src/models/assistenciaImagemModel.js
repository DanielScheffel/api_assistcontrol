import "dotenv/config";
import pool from "../config/database.js";

// Cria uma nova imagem de assistência
export async function criarImagemAssistencia( assistenciaID, file ) {
    const urlArquivo = `uploads/${file.filename}`;

    await pool.query(
        `INSERT INTO assistencia_imagem (assistencia_id, nome_arquivo, url_arquivo)
        VALUES ($1, $2, $3)`,
        [assistenciaID, file.filename, urlArquivo]
    )

    return {
        message: "Imagem de assistência cadastrada com sucesso",
        assistenciaID,
        nome_arquivo: file.filename,
        url_arquivo: urlArquivo
    }
}