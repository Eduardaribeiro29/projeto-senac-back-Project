// db.js — camada de acesso ao banco SQLite
//
// Por que SQLite?
// É um banco em arquivo, sem servidor separado. Perfeito para didática —
// o aluno não precisa instalar nada além do `sqlite3` via npm.
//
// O driver `sqlite` (que envolve o `sqlite3`) é a versão com Promises:
// em vez de callback, usamos async/await — combina com o restante do projeto.
//
// Conceitos da UC3 que aparecem aqui (Bloco A — Aulas 5, 10, 12):
// - CREATE TABLE com tipos e restrições (NOT NULL, UNIQUE, DEFAULT)
// - PRIMARY KEY com AUTOINCREMENT
// - FOREIGN KEY ligando tarefas → usuários
// - PRAGMA foreign_keys = ON; (SQLite só respeita FK quando isso é ativado)
// - ON DELETE CASCADE: ao apagar um usuário, apaga as tarefas dele.

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// guardamos a conexão em uma variável de módulo. Padrão "singleton":
// abre só uma vez e reutiliza em todos os controllers.
let dbConnection = null;

export async function getDatabase() {
  if (!dbConnection) {
    dbConnection = await open({
      filename: './src/data/database.db',
      driver: sqlite3.Database
    });

    // ativa restrições de Chave Estrangeira por conexão (SQLite vem desligado)
    await dbConnection.run('PRAGMA foreign_keys = ON;');

    // cria as tabelas caso ainda não existam (idempotente)
    await dbConnection.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        nome      TEXT NOT NULL,
        email     TEXT NOT NULL UNIQUE,
        telefone  TEXT,
        senha     TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tarefas (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo     TEXT NOT NULL,
        concluida  INTEGER NOT NULL DEFAULT 0,
        usuarioId  INTEGER NOT NULL,
        FOREIGN KEY (usuarioId) REFERENCES usuarios (id) ON DELETE CASCADE
      );
    `);
  }
  return dbConnection;
}
