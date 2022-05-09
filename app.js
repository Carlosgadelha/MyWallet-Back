import express from "express";
import chalk from "chalk";
import cors from "cors";
import dataBase from "./dataBase.js";
import joi from "joi";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import userRouter from "./routers/userRouter.js";
import operacoesRouter from "./routers/operacoesRouter.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use(userRouter);
app.use(operacoesRouter)

app.listen(3000, () => {
    console.log(chalk.green.bold("Server is running on port 3000"));
})