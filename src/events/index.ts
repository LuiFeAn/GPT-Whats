import { whats, gpt } from '../providers/index.js';

import path from 'path';
import fs from 'fs';

import WhatsListener from "../listeners/whatsListener.js";

import Bot from '../bot/Bot.js';

import BotError from '../errors/botError.js';
import { ChatGPTError } from 'chatgpt';

async function Events() {


    console.log('🤖: Olá ! Aguarde um pouco enquanto preparo tudo. \n')

    try{

        await gpt.initSession();

    }catch(err){

        if( err instanceof ChatGPTError ){

            console.log('🤖: Parece que os servidores do ChatGPT estão sobrecarregados no momento. Tente novamente mais tarde  \n');

            throw new BotError('Servidores do ChatGPT lotados');

        }

        console.log('🤖: Ocorreu um erro durante a minha preparação.\nPor favor, informe o diretório atual do seu chrome na variável de ambiente chamada "CHROME_PATH" \n');

        throw new BotError('Erro durante a inicialização do BOT por não encontrar o diretório do navegador chrome');

    }


    Bot.Initialize(function(){

        const verifySession = fs.existsSync(path.join('./localAuth/auth.key'));

        if ( verifySession ){

            console.log('🤖: Opa ! Parece que estou na ativa novamente ! \n');

        }else{

            console.log('🤖: Acabo de perceber que ainda não estou vinculado a um Whatsapp ! Então, por favor, utilize o QrCode abaixo para me autenticar: ');

        }

        whats.on('qr',WhatsListener.onQr);

        whats.on('authenticated',WhatsListener.onAuth);

        whats.on('ready',WhatsListener.onReady);

        whats.on('message',WhatsListener.onMessage);

        whats.initialize();


    });


}

export default Events();
