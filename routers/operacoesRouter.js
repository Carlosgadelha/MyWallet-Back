import { Router } from "express";
import { novaOperacao, buscarOperacoes } from "../controllers/operacoesController.js";

const operacoesRouter = new Router();

operacoesRouter.post('/operacoes', novaOperacao);
operacoesRouter.get('/operacoes', buscarOperacoes);

export default operacoesRouter;