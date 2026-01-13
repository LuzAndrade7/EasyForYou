import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
});

// Verificar conexión al iniciar
pool.query('SELECT NOW()')
  .then(() => console.log('Conectado a la base de datos'))
  .catch(err => console.error('Error de conexión a la base de datos:', err.message));
