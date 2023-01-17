import { whats, gpt } from '../providers/index.js';

import path from 'path';
import fs from 'fs';


import read from 'readline';


import WhatsListener from "../listeners/whatsListener.js";

import BotError from '../errors/botError.js';
import { ChatGPTError } from 'chatgpt';

const command = read.createInterface({
    input: process.stdin,
    output: process.stdout,
});


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

    const verifySession = fs.existsSync(path.join('./localAuth/auth.key'));

    if ( verifySession ){

        console.log('🤖: Opa ! Parece que estou na ativa novamente ! \n');

    }else{

        console.log('🤖: Acabo de perceber que ainda não estou vinculado a um Whatsapp ! Então, por favor, utilize o QrCode abaixo para me autenticar: ');

    }

    function reloadThis(){

        const verifyIfBotNameExists = fs.existsSync('botname.txt');

        if ( !verifyIfBotNameExists ){

            command.question('🤖: Pronto ! tudo certo.\nPara começarmos, por favor, me dê um nome ! esse nome será utilizado por mim no Whatsapp. \nQual será meu nome? \n\n', bot => {

                fs.writeFile('botname.txt', bot , async function(error){

                    if(error){

                        console.log('🤖: Algum erro ocorreu durante a minha nomeação. \n Vamos tentar novamente \n');

                        return;

                    }

                    console.log(`🤖: Então eu me chamo ${bot} ! Fantástico ! \n`);

                    return reloadThis();

                });

            });

        }

    }

    reloadThis();


    whats.on('qr',WhatsListener.onQr);

    whats.on('authenticated',WhatsListener.onAuth);

    whats.on('ready',WhatsListener.onReady);

    whats.on('message',WhatsListener.onMessage);

    whats.initialize();

}

export default Events();
