import "reflect-metadata";

import path from 'path';
import fs from 'fs';

import { gpt } from './providers/index.js';
import { ChatGPTError } from 'chatgpt';
import BotError from './errors/botError.js';

import './database/dbConfig.js';

import Events from './events/index.js';

async function init(){


    console.log('🤖: Olá ! Aguarde um pouco enquanto preparo tudo.');


    const verifySession = fs.existsSync(path.join('./localAuth/auth.key'));

    if ( verifySession ){

        console.log('🤖: Opa ! Parece que estou na ativa novamente !');

    }else{

        console.log('🤖: Acabo de perceber que ainda não estou vinculado a um Whatsapp ! Então, por favor, utilize o QrCode abaixo para me autenticar: ');

    }

    Events();

}

init();
