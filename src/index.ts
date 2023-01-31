import "reflect-metadata";

import path from 'path';
import fs from 'fs';

import { gpt } from './providers/index.js';
import { ChatGPTError } from 'chatgpt';
import BotError from './errors/botError.js';

import './database/dbConfig.js';

import Events from './events/index.js';

async function init(){


    console.log('🤖: Olá ! Aguarde um pouco enquanto preparo tudo.')

    try{

        await gpt.initSession();

    }catch(err){

        if( err instanceof ChatGPTError ){

            console.log('🤖: Parece que os servidores do ChatGPT estão sobrecarregados no momento. Irei tentar novamente');

            return init();

        }

        console.log('🤖: Ocorreu um erro durante a minha preparação.\nPor favor, informe o diretório atual do seu chrome na variável de ambiente chamada "CHROME_PATH"');

        throw new BotError('Erro durante a inicialização do BOT por não encontrar o diretório do navegador chrome');

    }

    const verifySession = fs.existsSync(path.join('./localAuth/auth.key'));

    if ( verifySession ){

        console.log('🤖: Opa ! Parece que estou na ativa novamente !');

    }else{

        console.log('🤖: Acabo de perceber que ainda não estou vinculado a um Whatsapp ! Então, por favor, utilize o QrCode abaixo para me autenticar: ');

    }

    Events();

}

init();
