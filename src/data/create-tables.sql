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