// db.js — camada de acesso ao banco PostgreSQL (Supabase)
//
// Mantemos os métodos all/get/run para não quebrar os controllers atuais.
// Internamente convertemos placeholders de SQLite (?) para PostgreSQL ($1, $2...).

import { Pool } from 'pg';
import 'dotenv/config';

let dbConnection = null;

function toPgPlaceholders(sql) {
  let index = 0;
  return sql.replace(/\?/g, () => {
    index += 1;
    return `$${index}`;
  });
}

function createAdapter(pool) {
  return {
    async all(sql, params = []) {
      const query = toPgPlaceholders(sql);
      const result = await pool.query(query, params);
      return result.rows;
    },

    async get(sql, params = []) {
      const query = toPgPlaceholders(sql);
      const result = await pool.query(query, params);
      return result.rows[0] ?? undefined;
    },

    async run(sql, params = []) {
      let query = toPgPlaceholders(sql);
      const isInsert = /^\s*insert\s+/i.test(sql);
      if (isInsert && !/\breturning\b/i.test(sql)) {
        query += ' RETURNING id';
      }

      const result = await pool.query(query, params);
      return {
        lastID: result.rows?.[0]?.id ?? null,
        changes: result.rowCount ?? 0
      };
    }
  };
}

export async function getDatabase() {
  if (!dbConnection) {
    const connectionString = process.env.CONN_STRINGS;

    if (!connectionString) {
      throw new Error('CONN_STRINGS não configurada no .env');
    }

    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });

    // valida conexão e cria schema inicial (idempotente)
    await pool.query('SELECT 1');

    dbConnection = createAdapter(pool);
  }

  return dbConnection;
}
