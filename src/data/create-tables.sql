CREATE TABLE IF NOT EXISTS usuarios (
        id        INTEGER PRIMARY KEY GENERATED ALWAYS as IDENTITY,
        nome      TEXT NOT NULL,
        email     TEXT NOT NULL UNIQUE,
        telefone  TEXT,
        senha     TEXT NOT NULL
      );

CREATE TABLE IF NOT EXISTS tarefas (
        id         INTEGER PRIMARY KEY GENERATED ALWAYS as IDENTITY,
        titulo     TEXT NOT NULL,
        concluida  INTEGER NOT NULL DEFAULT 0,
        usuarioId  INTEGER NOT NULL,
        FOREIGN KEY (usuarioId) REFERENCES usuarios (id) ON DELETE CASCADE
);