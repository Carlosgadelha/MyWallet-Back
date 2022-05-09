import dataBase from "../dataBase.js";
import joi from "joi";
import dayjs from "dayjs";

export async function novaOperacao(req, res) {

    const {valor, descricao, type} = req.body;
    const lastStatus = Date.now();
    const time = dayjs(lastStatus).format('HH:mm:ss');
    const authorization = req.headers.authorization;
    const token = authorization?.replace("Bearer", "").trim();
    if(!token) {
        console.log("erro 1")
        res.sendStatus(401);
        return;
    }

    const sessao = await dataBase.collection("sessoes").findOne({token});

    if(!sessao) {
        console.log("erro 2")
        res.status(401).send(authorization);
        return;
    }

    const usuarioSchema = joi.object({
        valor: joi.number().required(),
        descricao: joi.string().required(),
        type: joi.string().valid('entrada','saída').required()
    })

    const {error} = usuarioSchema.validate(req.body,{abortEarly: false});
    if(error)  return res.status(404).send(error.details.map( detail => detail.message));
    try {

        await dataBase.collection("operacoes").insertOne({
            valor: parseFloat(valor).toFixed(2),
            descricao,
            type,
            time,
            date: dayjs().format('DD/MM'),
            usuarioId: sessao.usuarioId
        });
        res.status(201).send("operação adicionada com sucesso");
       
    } catch (error) {
        res.sendStatus(500);
        console.log("Erro ao adicionar uma nova operação", error);
    }

}

export async function buscarOperacoes(req, res){

    const authorization = req.headers.authorization;
    const token = authorization?.replace("Bearer", "").trim();
    let saldo = 0;
    if(!token) {
        console.log("erro 1")
        res.sendStatus(401);
        return;
    }

    const sessao = await dataBase.collection("sessoes").findOne({token});

    if(!sessao) {
        console.log("erro 2")
        res.status(401).send(authorization);
        return;
    }

    
    try {
    
        const operacoes = await dataBase.collection("operacoes").find({usuarioId: sessao.usuarioId}).toArray()
        const saldo = operacoes.reduce((acc, valor) => {
            if(valor.type === 'entrada'){
                return acc + parseFloat(valor.valor);
            }else{
                return acc - parseFloat(valor.valor);
            }
        }, 0);

        const listOperacoes = operacoes.map(operacao => {
            // delete operacao._id;
            delete operacao.usuarioId;
            return operacao;
        });

        res.send({operacoes:listOperacoes,saldo: saldo.toFixed(2)});
       
    } catch (error) {
        res.status(500).send("Erro ao buscar operações");
    }

}