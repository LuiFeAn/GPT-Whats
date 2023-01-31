import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';

import configs from "../configs/index.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

dotenv.config();

const AppDataSource = new DataSource({

    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as undefined,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        `${path.join(__dirname,'../models/*.ts')}`
    ],
    migrations: [
        `${path.join(__dirname,'./migrations/*.ts')}`
    ],
    synchronize:false,

});

async function ConnectToDabase(){

    try{

        await AppDataSource.initialize();

        console.log('Conexão com o BD estabelecida com sucesso ! ✅🔥');

        configs.connectionWithDb = true;


    }catch{

        console.log('🤖: Não foi possível se conectar ao banco de dados ! Logo, todos os IDS com os contextos das suas sessões serão armazenados em memória');
        
        configs.connectionWithDb = false;
    }

}

ConnectToDabase();

export default AppDataSource