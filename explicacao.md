# Explicação Técnica do Projeto `projeto-senac-back`

## 1. Visão geral

Este projeto é uma API REST didática construída com Node.js, Express, PostgreSQL no Supabase e upload de imagens no Supabase Storage.

O foco é ensinar uma arquitetura simples que o aluno consegue manter manualmente:

- rotas em `src/routes`
- controllers em `src/controllers`
- autenticação e upload em `src/middlewares`
- banco em `src/data/db.js`
- SQL de referência em `src/data/create-tables.sql`

O fluxo principal é:

`frontend -> fetch -> index.js -> routes -> middlewares -> controllers -> db.js -> Supabase`

## 2. Tecnologias usadas

- `express`: servidor HTTP
- `pg`: conexão com PostgreSQL
- `@aws-sdk/client-s3`: envio de imagens para o Storage S3 compatível do Supabase
- `multer`: leitura de `multipart/form-data`
- `bcrypt`: hash de senha
- `jsonwebtoken`: JWT
- `helmet`: headers de segurança
- `dotenv`: variáveis de ambiente

## 3. Como a aplicação executa

Quando o servidor sobe:

1. `index.js` carrega o `.env`
2. cria o app Express
3. registra `helmet()`
4. registra `express.json()`
5. monta os routers de usuários e tarefas
6. começa a escutar na porta configurada

## 4. Como o banco funciona

O arquivo `src/data/db.js`:

- abre a conexão com o PostgreSQL do Supabase
- mantém a conexão reutilizável
- cria as tabelas básicas com `CREATE TABLE IF NOT EXISTS`
- entrega para os controllers uma interface simples com:
  `db.all(...)`
  `db.get(...)`
  `db.run(...)`

Mesmo com PostgreSQL, os controllers continuam usando placeholders `?`, porque `db.js` converte isso internamente para o formato do PostgreSQL.

## 5. Como a autenticação funciona

No login:

1. o controller procura o usuário pelo email
2. compara a senha com `bcrypt.compare`
3. gera o token com `jwt.sign`
4. devolve o token ao frontend

Nas rotas protegidas:

1. o frontend envia `Authorization: Bearer <token>`
2. o middleware `autenticacao.js` valida o token
3. o middleware coloca `req.usuarioId`
4. o controller usa esse id para filtrar ou autorizar a operação

## 6. Como o upload de imagem funciona

O projeto não salva mais imagens localmente.

Agora o fluxo é:

1. o frontend envia `multipart/form-data`
2. o middleware `uploadImagem.js` lê o arquivo com `multer`
3. o backend envia o arquivo para o Supabase Storage
4. o bucket usado é `arquivos`
5. a URL pública retornada é salva na coluna `foto`
6. o frontend usa essa URL para exibir a imagem

Para isso funcionar, o `.env` precisa ter:

- `SUPABASE_STORAGE_REGION`
- `SUPABASE_STORAGE_S3_ENDPOINT`
- `SUPABASE_STORAGE_ACCESS_KEY_ID`
- `SUPABASE_STORAGE_SECRET_ACCESS_KEY`
- `SUPABASE_STORAGE_PUBLIC_URL`
- `SUPABASE_STORAGE_BUCKET=arquivos`

## 7. Como os alunos devem criar uma nova tabela manualmente

O processo manual recomendado é:

1. desenhar os campos da entidade
2. escrever o SQL em `src/data/create-tables.sql`
3. copiar esse `CREATE TABLE` para `src/data/db.js`
4. subir o projeto para o backend garantir a criação
5. conferir no painel do Supabase se a tabela apareceu

Exemplo de raciocínio:

- entidade: `produtos`
- campos: `id`, `nome`, `descricao`, `preco`, `usuarioId`
- relacionamento: um produto pertence a um usuário

## 8. Como os alunos devem criar um novo CRUD manualmente

Depois da tabela:

1. criar `src/controllers/produtosController.js`
2. criar `src/routes/produtosRoutes.js`
3. implementar `listar`, `buscarPorId`, `criar`, `atualizar`, `remover`
4. registrar `app.use('/produtos', produtosRoutes)` em `index.js`
5. testar no navegador, no Insomnia ou no Postman

Esse é o padrão que deve ser repetido para qualquer recurso novo.

## 9. Como os alunos devem criar o frontend manualmente

Para cada recurso novo:

1. criar um formulário HTML
2. criar um arquivo JS para ler os campos do formulário
3. usar `fetch` para chamar a API
4. mostrar a resposta na tela
5. se houver token, guardar e reutilizar no `Authorization`
6. se houver imagem, usar `FormData`

## 10. Boas práticas deste projeto base

- evitar complexidade desnecessária
- não criar camada de `service` ou `repository` só por padrão
- manter o controller como ponto central da regra de negócio
- reaproveitar os middlewares existentes quando fizer sentido
- escrever SQL simples e fácil de ler
- manter nomes de arquivos e funções claros

## 11. Erros mais comuns

- `401 Token não enviado`: faltou o header `Authorization`
- `401 Token inválido ou expirado`: token vencido ou segredo diferente
- erro no upload: bucket `arquivos` não existe ou variáveis do Supabase não foram configuradas
- imagem não aparece: URL pública não foi salva corretamente
- tabela nova não aparece: o `CREATE TABLE` não foi colocado em `db.js`

## 12. Resumo final

Este projeto foi preparado para servir de base simples para o projeto final. O aluno consegue entender manualmente onde criar tabela, rota, controller, integração com frontend e upload de imagem sem depender de arquitetura avançada nem de automações extras.
