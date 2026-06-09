INSERT INTO usuarios (nome, email, telefone, senha, foto) VALUES
('Ana Costa', 'ana.costa@gmail.com', '27999881122', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12', 'http://localhost:3000/uploads/perfis/ana-costa.jpg'),
('João Silva', 'joao.silva@outlook.com', '11988882233', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12', 'http://localhost:3000/uploads/perfis/joao-silva.jpg'),
('Maria Silva', 'maria.silva@empresa.com', '21977773344', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12', NULL),
('Pedro Santos', 'pedro.santos@gmail.com', '27966664455', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12', NULL),
('Carlos Souza', 'carlos.souza@yahoo.com', '31955555566', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12', NULL),
('Ana Beatriz', 'ana.bia@outlook.com', '27944446677', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12', NULL),
('Ricardo Rocha', 'ricardo.rocha@empresa.com', '11933337788', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12', NULL),
('Beatriz Alves', 'beatriz.a@gmail.com', '21922228899', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12', NULL),
('Fernando Lima', 'fernando.lima@gmail.com', '31911119900', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12', NULL),
('Juliana Mendes', 'ju.mendes@outlook.com', '27900000011', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12', NULL);


INSERT INTO tarefas (titulo, descricao, concluida, usuarioId) VALUES
('Estudar Node.js e Express', 'Finalizar o modulo de rotas e controllers.', 1, 1),
('Estudar comandos SQL básicos', 'Praticar SELECT, JOIN e filtros no PostgreSQL.', 0, 1),
('Configurar ambiente na Cloud', 'Ajustar variaveis de ambiente no deploy.', 0, 1),
('Revisar código JavaScript do Frontend', 'Validar consumo da API e tratamento de erros.', 1, 2),
('Desenvolver página HTML sem CSS', 'Entregar estrutura semantica do layout.', 0, 2),
('Enviar relatório mensal de métricas', 'Consolidar dados de acesso e performance.', 1, 3),
('Reunião de alinhamento com diretoria', 'Apresentar progresso da sprint atual.', 1, 3),
('Responder e-mails pendentes de clientes', 'Priorizar demandas com prazo vencendo.', 0, 3),
('Atualizar documentação técnica da API', 'Incluir endpoints de upload e novos campos.', 0, 4),
('Corrigir bug no formulário de cadastro', 'Ajustar validacao de email duplicado.', 1, 5),
('Otimizar consultas e indexação do banco', 'Criar indice para colunas mais consultadas.', 0, 5),
('Estudar React, Vite e TypeScript', 'Revisar hooks e gerenciamento de estado.', 0, 6),
('Comprar insumos para o escritório', 'Listar materiais e solicitar aprovacao.', 1, 7),
('Fazer backup de segurança do banco', 'Executar rotina de backup noturno.', 1, 7),
('Planejar sprint do próximo produto', 'Definir backlog e prioridades com o time.', 0, 7),
('Testar usabilidade da nova tela', 'Coletar feedback de usuarios internos.', 0, 8),
('Ajustar responsividade do CSS', 'Corrigir quebrar de layout em telas pequenas.', 1, 8),
('Criar testes unitários para controllers', 'Cobrir cenarios de erro e sucesso.', 0, 9),
('Revisar permissões de segurança', 'Verificar regras de acesso por usuario.', 0, 9);