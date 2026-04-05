import 'dotenv/config';
import pkg from 'pg';


const { Pool } = pkg;

const db = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


(async () => {
    try {
        const client = await db.connect();
        console.log("Conexão com o banco de dados estabelecida com suceeso!");
        client.release();
    } catch (error) {
        console.log("Erro ao conectar com o banco: ",error);
    }
})();

export default db;