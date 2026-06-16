
# API REST — Projeto Base Final (SENAC / UC3)

Projeto base didático para os alunos continuarem o trabalho final em cima de uma estrutura simples, parecida com a usada em aula:

- backend em Node.js + Express
- banco PostgreSQL no Supabase
- autenticação com JWT
- upload de imagem no Supabase Storage, bucket `arquivos`
- frontend em HTML, CSS e JavaScript puro consumindo a API com `fetch`

O objetivo deste repositório é servir como base para os alunos criarem novas tabelas, novas rotas e novas telas manualmente, entendendo o processo antes de automatizar qualquer coisa.

## Stack

- Node.js 18+
- Express 4
- PostgreSQL via `pg`
- Supabase Storage (S3 compatível) via `@aws-sdk/client-s3`
- `bcrypt`
- `jsonwebtoken`
- `helmet`
- `dotenv`
- `multer`
- `nodemon` em desenvolvimento

## Estrutura de pastas

```text
projeto-senac-back/
├── .env
├── .env.exemple
├── index.js
├── package.json
├── README.md
└── src/
    ├── controllers/
    │   ├── tarefasController.js
    │   └── usuariosController.js
    ├── data/
    │   ├── create-tables.sql
    │   └── db.js
    ├── middlewares/
    │   ├── autenticacao.js
    │   └── uploadImagem.js
    └── routes/
        ├── tarefasRoutes.js
        └── usuariosRoutes.js
```

## Papel de cada parte

- `index.js`: inicia o servidor, registra middlewares globais e monta os routers.
- `src/routes/`: define as URLs e liga cada endpoint ao controller certo.
- `src/controllers/`: coloca a regra de negócio, valida dados, acessa o banco e devolve resposta HTTP.
- `src/middlewares/`: guarda regras reaproveitáveis, como autenticação JWT e upload.
- `src/data/db.js`: abre a conexão com o banco e garante as tabelas base.
- `src/data/create-tables.sql`: arquivo modelo com os `CREATE TABLE`, útil para estudo e para escrever novas tabelas manualmente.

## Como rodar

Pré-requisitos: Node.js 18+.

```bash
npm install
npm run dev
```

Ou, sem nodemon:

```bash
npm start
```

O servidor sobe em `http://localhost:3000` por padrão, ou na porta definida em `PORT`.

## Variáveis de ambiente

Use o arquivo `.env.exemple` como modelo para o `.env`.

| Variável | Função |
|---|---|
| `PORT` | Porta do backend |
| `JWT_SECRET` | Segredo usado para assinar os tokens |
| `JWT_EXPIRES_IN` | Validade do token |
| `CONN_STRINGS` | String de conexão PostgreSQL do Supabase |
| `SUPABASE_STORAGE_REGION` | Região do projeto no Storage S3 compatível |
| `SUPABASE_STORAGE_S3_ENDPOINT` | Endpoint S3 do Supabase Storage |
| `SUPABASE_STORAGE_ACCESS_KEY_ID` | Access key do S3 compatível |
| `SUPABASE_STORAGE_SECRET_ACCESS_KEY` | Secret key do S3 compatível |
| `SUPABASE_STORAGE_PUBLIC_URL` | Base da URL pública. Ex.: `https://project_ref.supabase.co/storage/v1/object/public` |
| `SUPABASE_STORAGE_BUCKET` | Nome do bucket de imagens. Neste projeto, use `arquivos` |

## Como configurar o Supabase Storage manualmente

Para o upload funcionar, o bucket precisa existir no Supabase.

1. Abra o painel do Supabase do projeto.
2. Entre em `Storage`.
3. Crie um bucket chamado `arquivos`.
4. Para facilitar o projeto didático, deixe esse bucket como público.
5. Em `Storage` > `S3 Access Keys`, gere as credenciais e preencha:
  `SUPABASE_STORAGE_ACCESS_KEY_ID`
  `SUPABASE_STORAGE_SECRET_ACCESS_KEY`
6. Defina também:
  `SUPABASE_STORAGE_REGION`
  `SUPABASE_STORAGE_S3_ENDPOINT` (formato `https://project_ref.storage.supabase.co/storage/v1/s3`)
  `SUPABASE_STORAGE_PUBLIC_URL` (formato `https://project_ref.supabase.co/storage/v1/object/public`)
7. Salve as variáveis no arquivo `.env`.

Com isso, quando o usuário enviar uma foto, o backend salva o arquivo no bucket `arquivos` e grava a URL pública na coluna `foto` da tabela `usuarios`.

## Como o upload funciona hoje

- O frontend envia `multipart/form-data` para a rota de atualização do usuário.
- O middleware `src/middlewares/uploadImagem.js` recebe a imagem com `multer` em memória.
- O backend envia o arquivo para o bucket `arquivos` no Supabase Storage.
- A URL pública retornada pelo Storage é salva no banco.
- O frontend pode usar essa URL diretamente no `src` da imagem.

## Processo manual para criar uma nova tabela

Esse é o fluxo que os alunos devem aprender a fazer sem Copilot.

1. Pensar quais campos a entidade precisa.
   Exemplo: `produtos` pode precisar de `id`, `nome`, `descricao`, `preco`, `usuarioId`.
2. Escrever o `CREATE TABLE` em `src/data/create-tables.sql`.
3. Copiar a mesma estrutura para o bloco de criação de tabelas em `src/data/db.js`, usando `CREATE TABLE IF NOT EXISTS`.
4. Se existir relacionamento, adicionar `FOREIGN KEY`.
5. Se a tabela depender do usuário logado, incluir `usuarioId` e usar `ON DELETE CASCADE` quando fizer sentido.

Exemplo simples:

```sql
CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco NUMERIC(10,2) NOT NULL,
  usuarioId INTEGER NOT NULL,
  FOREIGN KEY (usuarioId) REFERENCES usuarios (id) ON DELETE CASCADE
);
```

## Processo manual para criar controller e rotas

Depois da tabela, o aluno deve criar o CRUD seguindo o mesmo padrão dos arquivos já existentes.

1. Criar `src/controllers/produtosController.js`.
2. Implementar funções como:
   `listar`
   `buscarPorId`
   `criar`
   `atualizar`
   `remover`
3. Em cada função:
   validar o `req.body`
   abrir o banco com `getDatabase()`
   executar `db.all`, `db.get` ou `db.run`
   responder com `res.json(...)` ou `res.status(...).json(...)`
4. Criar `src/routes/produtosRoutes.js`.
5. Definir as rotas com `Router()`.
6. Se precisar de autenticação, aplicar `autenticarJWT`.
7. Registrar o router em `index.js` com algo como:

```js
import produtosRoutes from './src/routes/produtosRoutes.js';

app.use('/produtos', produtosRoutes);
```

## Processo manual para criar uma tela no frontend

Se o aluno estiver fazendo o frontend em HTML, CSS e JS puro, o fluxo deve ser:

1. Criar um arquivo HTML com formulário e área de listagem.
2. Criar um arquivo JS com:
   leitura do formulário
   chamada `fetch`
   tratamento da resposta
   atualização do DOM
3. Se a rota precisar de login, enviar o token no header `Authorization`.
4. Se a rota enviar imagem, usar `FormData` em vez de JSON.

Exemplo simples de criação com `fetch`:

```js
async function cadastrarProduto() {
  const resposta = await fetch('http://localhost:3000/produtos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      nome: 'Caderno',
      descricao: '200 folhas',
      preco: 29.9
    })
  });

  const dados = await resposta.json();
  console.log(dados);
}
```

## Processo manual para criar uma rota com upload

Quando o recurso precisar de imagem:

1. Criar o campo `foto`, `imagem` ou equivalente na tabela.
2. No frontend, usar `FormData`.
3. No backend, reaproveitar `processarUploadImagem`.
4. Salvar no banco a URL pública devolvida pelo Supabase Storage.
5. Mostrar essa URL no frontend com `<img src="...">`.

## Padrão de implementação que deve ser seguido

- manter `routes` separadas de `controllers`
- colocar SQL e regra de negócio no controller, seguindo o padrão atual
- usar `getDatabase()` para acessar o banco
- manter SQL simples, direto e legível
- usar nomes claros para arquivos, funções e colunas
- evitar criar camadas extras como `services` ou `repositories` sem necessidade didática

## Problemas comuns

| Problema | Causa provável |
|---|---|
| `401 Token não enviado` | faltou o header `Authorization: Bearer ...` |
| `401 Token inválido ou expirado` | token vencido ou `JWT_SECRET` diferente |
| `process.env.JWT_SECRET` vazio | `.env` não foi carregado corretamente |
| `Erro ao enviar imagem para o Supabase Storage` | bucket não criado ou variáveis `SUPABASE_STORAGE_*` ausentes/incorretas |
| a imagem não aparece no frontend | a URL pública não foi salva corretamente ou o bucket não está acessível |

## Licença

Uso livre para fins educacionais.
