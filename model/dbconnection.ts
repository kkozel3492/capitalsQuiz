import pg from "pg";
import dotenv from "dotenv"

dotenv.config();
const password = process.env.PASSWORD;
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT)
});

db.connect();

db.query("SELECT * FROM capitals", (err,res) => {
    if (err) {
        console.error("Error executing query", err.stack);
    }
    else {
        let quiz = res.rows;
    }

    db.end();
})