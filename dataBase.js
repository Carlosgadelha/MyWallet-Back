import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let dataBase;
const mongoClient = new MongoClient(process.env.DB_URL); 

await mongoClient.connect()
    .then(() => {
    dataBase = mongoClient.db(process.env.DB_DATABASE);
    console.log("Connected successfully to server");
    })
    .catch(err => {
        console.log("conexion error: " + err);
    })

export default dataBase;