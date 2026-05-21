
# API REST — Usuários e Tarefas (SENAC / UC3)

Projeto didático em Node.js + Express + PostgreSQL (Supabase) cobrindo o conteúdo da **UC3** (Programador Web — SENAC):

- **Bloco A** — SQL no Node com PostgreSQL (prepared statements)
- **Bloco B** — manter estado entre requisições (aqui via **JWT** — alternativa a session, slide 33)
- **Bloco C** — segurança: bcrypt, helmet, dotenv, validações, princípio do menor privilégio

Material de apoio à atividade descrita em `Guia-Construcao-API-REST.docx`. Use como referência depois de tentar implementar sozinho.

---

## Stack

- Node.js 18+
- Express 4
- PostgreSQL via `pg` (compatível com Supabase)
- `bcrypt` — hash de senhas
- `jsonwebtoken` — autenticação stateless via JWT
- `helmet` — cabeçalhos HTTP de segurança
- `dotenv` — segredos fora do código-fonte
- `cors`
- `nodemon` (apenas em desenvolvimento)
- ES Modules (`import` / `export`)

---

## Estrutura de pastas

```
projeto-senac-back/
├── .env.example                 # modelo do .env (versionado)
├── .env                         # segredos reais (IGNORADO pelo git)
├── .gitignore
├── package.json
├── index.js                     # ponto de entrada do servidor
└── src/
    ├── data/
    │   └── db.js                # conexão PostgreSQL + CREATE TABLE
    ├── middlewares/
    │   └── autenticacao.js      # valida o JWT no header Authorization
    ├── controllers/
    │   ├── usuariosController.js   # CRUD + login + perfil
    │   └── tarefasController.js
    └── routes/
        ├── usuariosRoutes.js
        └── tarefasRoutes.js
```

### Responsabilidade de cada camada

| Camada | Responsabilidade |
|---|---|
| `index.js` | Sobe o Express, registra middlewares globais (`helmet`, `cors`, `express.json`) e monta as rotas. |
| `routes/` | Mapeia verbo HTTP + caminho para a função do controller. Aplica o middleware de autenticação onde necessário. |
| `middlewares/` | Funções que rodam antes do controller. Aqui: verificação do JWT. |
| `controllers/` | Lógica do CRUD: validações, queries SQL, respostas HTTP. |
| `data/db.js` | Abre a conexão PostgreSQL e garante o schema (idempotente). |

---

## Como rodar

Pré-requisitos: Node.js 18+ (`node -v`).

```bash
# 1) instalar dependências
npm install

# 2) preparar variáveis de ambiente
cp .env.example .env           # Linux/macOS
# no Windows: copy .env.example .env

# 3) rodar em modo desenvolvimento (auto-reload com nodemon)
npm run dev

# ou rodar normalmente
npm start
```

Servidor sobe em `http://localhost:3000` (ou a `PORT` definida no `.env`).

---

## Variáveis de ambiente

Arquivo `.env` na raiz do projeto. Use `.env.example` como modelo.

| Variável | Para que serve |
|---|---|
| `PORT` | Porta do servidor HTTP. Padrão `3000`. |
| `JWT_SECRET` | Segredo usado para assinar os tokens JWT. **Troque em produção.** |
| `JWT_EXPIRES_IN` | Tempo de validade do token. Ex.: `15m`, `1h`, `1d`, `7d`. |
| `DATABASE_URL` | String de conexão PostgreSQL do Supabase. |

> `.env` está no `.gitignore`. Nunca commite segredos reais.

---

## Endpoints

Base URL: `http://localhost:3000`

### Usuários — `/usuarios`

Tudo de usuário (cadastro, login, perfil, CRUD) está sob o mesmo recurso. As duas primeiras rotas são públicas; o restante exige o header `Authorization: Bearer <token>`.

| Verbo | Caminho | Protegido? | Descrição |
|---|---|---|---|
| POST | `/usuarios` | **não** | Cadastra novo usuário (senha vai hash via bcrypt) |
| POST | `/usuarios/login` | **não** | Recebe `email` + `senha`, devolve um JWT |
| GET | `/usuarios/perfil` | sim | Dados do usuário do token (rota protegida modelo) |
| GET | `/usuarios` | sim | Lista todos os usuários (sem o campo senha) |
| GET | `/usuarios/:id` | sim | Busca usuário por id |
| PUT | `/usuarios/:id` | sim | Atualiza parcialmente — só o próprio usuário (403 caso contrário) |
| DELETE | `/usuarios/:id` | sim | Remove — só o próprio usuário |

> **Detalhe importante para os alunos:** em `usuariosRoutes.js`, `/perfil` precisa ser declarada **antes** de `/:id`. O Express resolve as rotas na ordem em que foram registradas — se `/:id` viesse primeiro, ele trataria `perfil` como um valor de `:id`.

**Modelo de usuário** (resposta — `senha` nunca aparece no JSON)

```json
{
  "id": 1,
  "nome": "Maria",
  "email": "maria@example.com",
  "telefone": "27999999999"
}
```

Campos obrigatórios no POST: `nome`, `email`, `telefone`, `senha` (mínimo 6 caracteres).

### Tarefas — `/tarefas` (todas protegidas)

Em todas as rotas, o `usuarioId` é obtido do **token** — não vem do body. Cada usuário só enxerga e altera as próprias tarefas.

| Verbo | Caminho | Descrição |
|---|---|---|
| GET | `/tarefas` | Lista tarefas do usuário logado |
| GET | `/tarefas/:id` | Busca tarefa por id (apenas se for do usuário logado) |
| GET | `/tarefas/usuario/:usuarioId` | Lista as tarefas — apenas o próprio (403 caso contrário) |
| POST | `/tarefas` | Cria tarefa. Body: `{ "titulo": "..." }` |
| PUT | `/tarefas/:id` | Atualiza parcialmente. Body aceita `titulo` e/ou `concluida` (boolean) |
| DELETE | `/tarefas/:id` | Remove tarefa |

**Modelo de tarefa**

```json
{
  "id": 1,
  "titulo": "Estudar Node",
  "concluida": false,
  "usuarioId": 1
}
```

---

## Fluxo de autenticação (passo a passo)

1. **Cadastrar usuário** (público):

   ```bash
   curl -X POST http://localhost:3000/usuarios \
     -H "Content-Type: application/json" \
     -d '{
       "nome": "Maria",
       "email": "maria@example.com",
       "telefone": "27988887777",
       "senha": "123456"
     }'
   ```

2. **Fazer login** — a resposta traz `token`:

   ```bash
   curl -X POST http://localhost:3000/usuarios/login \
     -H "Content-Type: application/json" \
     -d '{ "email": "maria@example.com", "senha": "123456" }'
   ```

   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIs...",
     "usuario": { "id": 1, "nome": "Maria", "email": "maria@example.com" }
   }
   ```

3. **Chamar rotas protegidas** enviando o token no header `Authorization`:

   ```bash
   curl http://localhost:3000/usuarios/perfil \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
   ```

4. **Criar tarefa** (o `usuarioId` vem do token, não do body):

   ```bash
   curl -X POST http://localhost:3000/tarefas \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
     -d '{ "titulo": "Estudar Node" }'
   ```

5. **Marcar como concluída**:

   ```bash
   curl -X PUT http://localhost:3000/tarefas/1 \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
     -d '{ "concluida": true }'
   ```

---

## Códigos de status usados

| Código | Quando |
|---|---|
| 200 | OK em GET, PUT e DELETE |
| 201 | Recurso criado com sucesso (POST) |
| 400 | Body inválido / campos obrigatórios ausentes |
| 401 | Não autenticado (sem token ou token inválido/expirado) |
| 403 | Autenticado mas sem permissão (ex.: tentar editar outro usuário) |
| 404 | Recurso não encontrado por id |
| 409 | Conflito (email já cadastrado) |

---

## Conceitos da UC3 exercitados em cada arquivo

| Arquivo | Conteúdo da UC3 |
|---|---|
| `src/data/db.js` | Bloco A — CREATE TABLE, tipos, NOT NULL, UNIQUE, AUTOINCREMENT, FOREIGN KEY, PRAGMA foreign_keys |
| `src/controllers/usuariosController.js` | Bloco A — INSERT/SELECT/UPDATE/DELETE com `?` · Bloco C — bcrypt.hash + bcrypt.compare, não devolver senha · Bloco B alternativo — JWT em vez de session (slide 33) |
| `src/controllers/tarefasController.js` | Bloco A — CRUD com WHERE · Bloco C — princípio do menor privilégio (filtra por `usuarioId` do token) |
| `src/middlewares/autenticacao.js` | Bloco B/C — autenticação de cada requisição via header `Authorization` |
| `index.js` | Bloco C — helmet (cabeçalhos), dotenv (segredos fora do código), CORS |

---

## Checklist de segurança aplicado (UC3 — slide 45)

- [x] Toda query usa parâmetro preparado (`?`) — nunca concatenação com `${}`
- [x] Senhas guardadas com `bcrypt.hash` (10 rounds)
- [x] `JWT_SECRET` no `.env`, `.env` no `.gitignore`
- [x] `app.use(helmet())` ativo
- [x] Mensagens de erro genéricas no login (não diz se o e-mail existe)
- [x] Campo `senha` nunca aparece nas respostas
- [x] `ON DELETE CASCADE` mantém o banco consistente

---

## Limitações conhecidas (são propositais — didático)

- Sem refresh token / blacklist. Quando o token vaza, vale até expirar.
- Sem rate limiting (slide 40 cita — pode entrar como desafio).
- Sem logger estruturado. Em produção: pino/winston.
- Sem testes automatizados.

---

## Desafios sugeridos para os alunos

1. Validar formato do email com regex no cadastro.
2. Adicionar paginação na listagem de tarefas (`LIMIT` / `OFFSET`, slide 12).
3. Criar `GET /tarefas/stats` que devolve `{ total, concluidas, pendentes }` usando `COUNT` + `WHERE` (slide 13).
4. Implementar busca por título com `LIKE '%termo%'` (slide 12).
5. Implementar rate limiting com `express-rate-limit` na rota `/usuarios/login`.
6. Trocar JWT por `express-session` (slides 29–32) e comparar as duas abordagens.
7. Adicionar uma rota `GET /usuarios/:id/tarefas` usando `INNER JOIN` (slide 17) que devolve nome do usuário junto.

---

## Erros comuns

| Sintoma | Provável causa |
|---|---|
| `SyntaxError: Cannot use import statement outside a module` | Faltou `"type": "module"` no `package.json`. |
| `req.body` chega como `undefined` | Faltou `app.use(express.json())` no `index.js`. |
| `Cannot find module './foo'` | Em ESM a extensão `.js` no import é obrigatória. |
| `401 Token não enviado` | Esqueceu o header `Authorization: Bearer <token>`. |
| `401 Token inválido ou expirado` | Token vencido (gere novo via `/usuarios/login`) ou `JWT_SECRET` diferente entre quem assinou e quem verifica. |
| `process.env.JWT_SECRET` vazio | Faltou `.env` na raiz ou `import 'dotenv/config'` antes do uso. |

---

## Licença

Uso livre para fins educacionais.
