import { Router } from "express";
import { cadastrar, login } from "../controllers/userController.js";

const userRouter = new Router();

userRouter.post('/login', login);
userRouter.post('/cadastrar', cadastrar);

export default userRouter;