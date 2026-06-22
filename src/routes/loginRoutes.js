import { Router } from 'express';
import * as controller from '../controllers/loginController.js';
import { autenticarJWT } from '../middlewares/autenticacao.js';

const router = Router();

// aplica autenticação em todas as rotas montadas neste router
router.use(autenticarJWT);

router.post('/', controller.criar);

export default router;