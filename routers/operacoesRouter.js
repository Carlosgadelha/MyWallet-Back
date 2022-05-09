import { Router } from "express";
import { novaOperacao, buscarOperacoes } from "../controllers/operacoesController.js";
import { validateToken } from "../middlewares/authMidleware.js";
import { validateInputs } from "../middlewares/operacaoesMidleware.js";


const operacoesRouter = new Router();

operacoesRouter.use(validateToken);

operacoesRouter.post('/operacoes',validateInputs, novaOperacao);
operacoesRouter.get('/operacoes', buscarOperacoes);

export default operacoesRouter;