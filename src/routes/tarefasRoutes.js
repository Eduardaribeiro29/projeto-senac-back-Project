// tarefasRoutes.js — mapeia verbos HTTP do recurso /tarefas para o controller
//
// Todas as rotas aqui são PROTEGIDAS: precisam de um JWT válido no header
// Authorization. O middleware autenticarJWT popula req.usuarioId para que
// os controllers saibam quem é o usuário logado.

import { Router } from 'express';
import * as controller from '../controllers/tarefasController.js';
import { autenticarJWT } from '../middlewares/autenticacao.js';

const router = Router();

// aplica autenticação em todas as rotas montadas neste router
router.use(autenticarJWT);

router.get('/', controller.listar);                              // GET    /tarefas
router.get('/usuario/:usuarioId', controller.listarPorUsuario);  // GET    /tarefas/usuario/:usuarioId
router.get('/:id', controller.buscarPorId);                      // GET    /tarefas/:id
router.post('/', controller.criar);                              // POST   /tarefas
router.put('/:id', controller.atualizar);                        // PUT    /tarefas/:id
router.delete('/:id', controller.remover);                       // DELETE /tarefas/:id

export default router;
