import "dotenv/config";
import pool from "../config/database.js";

export async function categoryModel( category ) {

    const result = await pool.query("SELECT * FROM categoria_produto WHERE categoria = $1", [category]);
    const rows = result.rows;

    if(rows.length > 0){
        throw new Error("Categoria já cadastrada");
    }

    await pool.query(
        `INSERT INTO categoria_produto (categoria) VALUES ($1)`,
        [category]
    )

    return {
        message: "Categoria cadastrada com sucesso"
    }
}

export async function deleteCategoryModel( categoryID ) {

    await pool.query(
        "DELETE FROM categoria_produto WHERE id_categoria_produto = $1",
        [categoryID]
    )

    return {
        message: "Categoria deletada com sucesso"
    }
}