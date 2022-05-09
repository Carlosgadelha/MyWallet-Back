import joi from "joi";

export async function validateInputs(req, res, next) {

    const inputSchema = joi.object({
        valor: joi.number().required(),
        descricao: joi.string().required(),
        type: joi.string().valid('entrada','saída').required()
    })

    const {error} = inputSchema.validate(req.body,{abortEarly: false});
    if(error)  return res.status(404).send(error.details.map( detail => detail.message));
    next();

};