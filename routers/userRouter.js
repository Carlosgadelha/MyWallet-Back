import { Router } from "express";
import { cadastrar, login } from "../controllers/userController.js";
import { validateCadastro } from "../middlewares/cadastroMidleware.js";

const userRouter = new Router();

userRouter.post('/login', login);
userRouter.post('/cadastrar', validateCadastro, cadastrar);

export default userRouter;