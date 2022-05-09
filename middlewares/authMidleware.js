import dataBase from "../dataBase.js";

export async function validateToken(req, res,next) {

    const authorization = req.headers.authorization;
    const token = authorization?.replace("Bearer", "").trim();

    if(!token) {
        res.status(401).sen("Token não informado");
        return;
    }

    try {
        const sessao = await dataBase.collection("sessoes").findOne({token});

        if(!sessao) {
            res.status(401).send(authorization);
            return;
        }

        res.locals.sessao = sessao;
        next();
    } catch (error) {
        res.status(500).send("Erro ao checar token");
        
    }

};