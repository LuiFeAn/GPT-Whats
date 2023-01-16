import { whats } from '../providers/index.js';

import path from 'path';
import fs from 'fs';

import WhatsListener from "../listeners/whatsListener.js";

import Bot from '../bot/Bot.js';

async function Events() {


    console.log('🤖: Olá ! Aguarde um pouco enquanto preparo tudo. \n')

    // try{

    //     await gpt.initSession();

    // }catch(err){

    //     console.log('🤖: Ops ! Algum erro ocorreu. Irei tentar novamente')

    // }


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
