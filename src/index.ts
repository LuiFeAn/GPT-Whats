import { ChatGPTAPIBrowser } from 'chatgpt';
import Whatsapp from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import onMessage from './listeners/onMessage.js';

import { IUser } from './interfaces/IUser.js';

dotenv.config();

export const users: IUser [] = [];

export const gpt = new ChatGPTAPIBrowser({
    email: process.env.CHATGPT_EMAIL as string,
    password: process.env.CHATGPT_PASSWORD as string,
    isGoogleLogin:true,
});


export const whats = new Whatsapp.Client({
    authStrategy: new Whatsapp.LocalAuth({
        dataPath:'./localAuth'
    }),
});


async function StartBot(){

    
    console.log('🤖: Aguarde um pouco enquanto preparo tudo.')
    
    // try{
    
    //     await gpt.initSession();
    
    // }catch(err){
        
    //     console.log('🤖: Ops ! Algum erro ocorreu. Irei tentar novamente')
    
    // }

    console.log('🤖: Pronto ! tudo certo para iniciarmos.');

    const verifySession = fs.existsSync(path.join('./localAuth'));

    if ( !verifySession ){

        console.log('🤖: Ops ! parece que você não está conectado ao WhatsApp. \n Por favor, utilize o QrCode abaixo para se autenticar');
    }

    console.log('🤖: Bem-vindo novamente !')
    
    whats.on('qr', qr => qrcode.generate(qr,{
        small:true
    }));

    whats.initialize();


}

StartBot();



