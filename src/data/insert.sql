INSERT INTO usuarios (nome, email, telefone, senha) VALUES
('Ana Costa', 'ana.costa@gmail.com', '27999881122', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12'),
('João Silva', 'joao.silva@outlook.com', '11988882233', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12'),
('Maria Silva', 'maria.silva@empresa.com', '21977773344', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12'),
('Pedro Santos', 'pedro.santos@gmail.com', '27966664455', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12'),
('Carlos Souza', 'carlos.souza@yahoo.com', '31955555566', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12'),
('Ana Beatriz', 'ana.bia@outlook.com', '27944446677', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12'),
('Ricardo Rocha', 'ricardo.rocha@empresa.com', '11933337788', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12'),
('Beatriz Alves', 'beatriz.a@gmail.com', '21922228899', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12'),
('Fernando Lima', 'fernando.lima@gmail.com', '31911119900', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12'),
('Juliana Mendes', 'ju.mendes@outlook.com', '27900000011', '$2b$10$iE7LWj//5zWPn1Hl.vfHZuRkRmSr3P5a/no2a8lK7ELx1Y/ZPut12');


INSERT INTO tarefas (titulo, concluida, usuarioId) VALUES
('Estudar Node.js e Express', 1, 1),
('Estudar comandos SQL básicos', 0, 1),
('Configurar ambiente na Cloud', 0, 1),
('Revisar código JavaScript do Frontend', 1, 2),
('Desenvolver página HTML sem CSS', 0, 2),
('Enviar relatório mensal de métricas', 1, 3),
('Reunião de alinhamento com diretoria', 1, 3),
('Responder e-mails pendentes de clientes', 0, 3),
('Atualizar documentação técnica da API', 0, 4),
('Corrigir bug no formulário de cadastro', 1, 5),
('Otimizar consultas e indexação do banco', 0, 5),
('Estudar React, Vite e TypeScript', 0, 6),
('Comprar insumos para o escritório', 1, 7),
('Fazer backup de segurança do banco', 1, 7),
('Planejar sprint do próximo produto', 0, 7),
('Testar usabilidade da nova tela', 0, 8),
('Ajustar responsividade do CSS', 1, 8),
('Criar testes unitários para controllers', 0, 9),
('Revisar permissões de segurança', 0, 9);