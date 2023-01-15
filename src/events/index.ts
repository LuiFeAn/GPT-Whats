import { whats } from '../providers/index.js';

import path from 'path';
import fs from 'fs';

import WhatsListener from "../listeners/whatsListener.js";

async function Events(){


    console.log('🤖: Aguarde um pouco enquanto preparo tudo.')

    // try{

    //     await gpt.initSession();

    // }catch(err){

    //     console.log('🤖: Ops ! Algum erro ocorreu. Irei tentar novamente')

    // }

    console.log('🤖: Pronto ! tudo certo para iniciarmos.');

    const verifySession = fs.existsSync(path.join('./localAuth/auth.key'));

    if ( verifySession ){

        console.log('🤖: Bem-vindo novamente !');

    }else{

        console.log('🤖: Ops ! parece que você não está conectado ao WhatsApp. \n Por favor, utilize o QrCode abaixo para se autenticar');

    }

    whats.on('qr',WhatsListener.onQr);

    whats.on('authenticated',WhatsListener.onAuth);

    whats.on('ready',WhatsListener.onReady);

    whats.on('message',WhatsListener.onMessage);

    whats.initialize();


}

export default Events();
