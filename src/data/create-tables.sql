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
        foto      TEXT,
        profissao TEXT NOT NULL,
      );

CREATE TABLE IF NOT EXISTS produtos (
        id         INTEGER PRIMARY KEY GENERATED ALWAYS as IDENTITY,
        titulo     TEXT NOT NULL,
        descricao  TEXT,
        data_validade DATE NOT NULL,
        data_fabricacao DATE NOT NULL
        quantidade INTEGER,
        foto      TEXT,
      );


CREATE TABLE IF NOT EXISTS produtos (
        id         INTEGER PRIMARY KEY GENERATED ALWAYS as IDENTITY,
        titulo     TEXT NOT NULL,
        descricao  TEXT,
        data_validade DATE NOT NULL,
        usuarioId  INTEGER NOT NULL,
        FOREIGN KEY (usuarioId) REFERENCES usuarios (id) ON DELETE CASCADE
);