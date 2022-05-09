import dataBase from "../dataBase.js";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function login(req, res) {
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
            res.status(201).send({token,name: usuario.name});
            console.log("usuario logado");
        }else{
            res.status(404).send('email ou senha incorretos');
        }

        
    } catch (error) {
        res.sendStatus(500);
        console.log("Erro ao criar usuario", error);
    }
}

export async function cadastrar (req, res) {
    const { name, email, senha, confirmacaoSenha } = req.body;
    if (senha !== confirmacaoSenha) req.sendStatus(404);
    
    try {
        const usuario = await dataBase.collection("usuarios").findOne({ email });
        if (usuario) return res.status(404).send('email já cadastrado');
        await dataBase.collection("usuarios").insertOne({
            name,
            email,
            senha: bcrypt.hashSync(senha, 10)
        });

        res.sendStatus(201);
    } catch (error) {
        res.status(500).send("Erro ao criar usuario", error);
    }
        
}