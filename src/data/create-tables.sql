-- Arquivo de apoio para os alunos enxergarem o SQL das tabelas base.
-- Quando for criar uma tabela nova manualmente:
-- 1) escreva o CREATE TABLE aqui como rascunho e referencia;
-- 2) copie a mesma estrutura para src/data/db.js;
-- 3) suba o projeto para o backend executar o CREATE TABLE IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS usuarios (
        id        INTEGER PRIMARY KEY GENERATED ALWAYS as IDENTITY,
        nome      TEXT NOT NULL,
        email     TEXT NOT NULL UNIQUE,
        telefone  TEXT,
        senha     TEXT NOT NULL,
        foto      TEXT
      );

CREATE TABLE IF NOT EXISTS tarefas (
        id         INTEGER PRIMARY KEY GENERATED ALWAYS as IDENTITY,
        titulo     TEXT NOT NULL,
        descricao  TEXT,
        status     TEXT NOT NULL DEFAULT 'Novo',
        usuarioId  INTEGER NOT NULL,
        FOREIGN KEY (usuarioId) REFERENCES usuarios (id) ON DELETE CASCADE
);