import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

let pool = null;

export async function getPool() {
  if (!pool) {
    // First ensure database exists
    try {
      const tempConnection = await mysql.createConnection(dbConfig);
      await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'educol3d_db'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      await tempConnection.end();

      pool = mysql.createPool({
        ...dbConfig,
        database: process.env.DB_NAME || 'educol3d_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      console.log(`[MySQL] Conectado exitosamente a la base de datos "${process.env.DB_NAME || 'educol3d_db'}" en ${dbConfig.host}:${dbConfig.port}`);
    } catch (err) {
      console.warn(`[MySQL Warning] No se pudo conectar directamente a MySQL (${err.message}). Se usará modo de datos dinámico.`);
      return null;
    }
  }
  return pool;
}

export async function initDatabase() {
  try {
    const currentPool = await getPool();
    if (!currentPool) return false;
    const sqlPath = path.join(__dirname, '../database/schema.sql');
    if (fs.existsSync(sqlPath)) {
      const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
      await currentPool.query(sqlContent);
      console.log('[MySQL Init] Tablas y datos creados correctamente desde schema.sql');
      return true;
    }
  } catch (error) {
    console.error('[MySQL Init Error]', error.message);
    return false;
  }
}
