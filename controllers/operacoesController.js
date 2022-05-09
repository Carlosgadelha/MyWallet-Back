import dataBase from "../dataBase.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

export async function novaOperacao(req, res) {

    const {valor, descricao, type} = req.body;
    const lastStatus = Date.now();
    const time = dayjs(lastStatus).format('HH:mm:ss');
    
    try {

        const {sessao} = res.locals;

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
        res.status(500).send("Erro ao adicionar operação", error);
    }

}

export async function buscarOperacoes(req, res){

    let saldo = 0;
    try {

        const {sessao} = res.locals;
    
        const operacoes = await dataBase.collection("operacoes").find({usuarioId: sessao.usuarioId}).toArray()
        const saldo = operacoes.reduce((acc, valor) => {
            if(valor.type === 'entrada'){
                return acc + parseFloat(valor.valor);
            }else{
                return acc - parseFloat(valor.valor);
            }
        }, 0);

        const listOperacoes = operacoes.map(operacao => {
            delete operacao.usuarioId;
            return operacao;
        });

        res.send({operacoes:listOperacoes,saldo: saldo.toFixed(2)});
       
    } catch (error) {
        res.status(500).send("Erro ao buscar operações");
    }

}

export async function deletar(req, res){
    
    const {id} = req.params;

    try{
		
        await dataBase.collection("operacoes").deleteOne({ _id: new ObjectId(id) } )
        res.status(200).send("Operação deletada com sucesso");

	}catch(error){
        res.status(500).send("Erro ao deletar operação", error);
	
	};
}

export async function atualizar(req, res){
    
    const {id} = req.params;
    const {valor, descricao} = req.body;
    const lastStatus = Date.now();
    const time = dayjs(lastStatus).format('HH:mm:ss');

    try{
		
        await dataBase.collection("operacoes").updateOne({ _id: new ObjectId(id) },
            { $set: {
                valor,
                descricao,
                time,
                date: dayjs().format('DD/MM')
            }} );
        res.status(200).send("Operação atualizada com sucesso");

	}catch(error){
        res.status(500).send("Erro ao atualizar operação", error);
	
	};
}