import express from "express";
import chalk from "chalk";
import cors from "cors";
import dataBase from "./dataBase.js";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const app = express();
app.use(express.json());
app.use(cors());

// uuarios 
app.post('/cadastrar', async (req, res) => {
    const { name, email, senha, confirmacaoSenha } = req.body;
    if (senha !== confirmacaoSenha) req.sendStatus(404);

    const usuarioSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        senha: joi.string().required(),
        confirmacaoSenha: joi.string().required()
    })

    const {error} = usuarioSchema.validate(req.body,{abortEarly: false});
    if(error)  return res.status(404).send(error.details.map( detail => detail.message));
    
    try {
        const usuario = await dataBase.collection("usuarios").findOne({ email });
        if (usuario) return res.status(404).send('email já cadastrado');
        await dataBase.collection("usuarios").insertOne({
            name,
            email,
            senha: bcrypt.hashSync(senha, 10)
        });
        console.log("usuario criado");
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
        console.log("Erro ao criar usuario", error);
    }
        
})

app.get('/login', async(req, res) => {
    const {email, senha} = req.body;

    const usuarioSchema = joi.object({
        email: joi.string().required(),
        senha: joi.string().required()
    })

    const {error} = usuarioSchema.validate(req.body,{abortEarly: false});
    if(error)  return res.status(404).send(error.details.map( detail => detail.message));

    try {
        const usuario = await dataBase.collection("usuarios").findOne({ email});
        if (usuario && bcrypt.compareSync(senha,usuario.senha)){
            const token = uuid();
            await dataBase.collection("sessoes").insertOne({ token, usuarioId: usuario._id });
            res.status(201).send(token);
            console.log("usuario logado");
        }else{
            res.status(404).send('email ou senha incorretos');
        }

        
    } catch (error) {
        res.sendStatus(500);
        console.log("Erro ao criar usuario", error);
    }
});

// operações

app.post("/operacoes",async (req, res) => {
    const {valor, descricao, type} = req.body;

    const usuarioSchema = joi.object({
        value: joi.number().required(),
        descricao: joi.string().required(),
        type: joi.string().valid('entrada','saida').required()
    })

    const {error} = usuarioSchema.validate(req.body,{abortEarly: false});
    if(error)  return res.status(404).send(error.details.map( detail => detail.message));

    try {
        await dataBase.collection("operacoes").insertOne(req.body);
        res.status(201).send("operação adicionada com sucesso");
       
    } catch (error) {
        res.sendStatus(500);
        console.log("Erro ao adicionar uma nova operação", error);
    }

});


app.listen(3000, () => {
    console.log(chalk.green.bold("Server is running on port 3000"));
})