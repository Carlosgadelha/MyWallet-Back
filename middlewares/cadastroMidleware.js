import joi from "joi";

export async function validateCadastro(req, res, next) {

    const usuarioSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        senha: joi.string().required(),
        confirmacaoSenha: joi.string().required()
    })

    const {error} = usuarioSchema.validate(req.body,{abortEarly: false});
    if(error)  return res.status(404).send(error.details.map( detail => detail.message));
    
    next();

};