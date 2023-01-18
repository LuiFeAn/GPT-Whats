import read from 'readline';
import path from 'path';
import fs from 'fs';

import { gpt } from './providers/index.js';
import { ChatGPTError } from 'chatgpt';
import BotError from './errors/botError.js';

import Events from './events/index.js';


async function initialize(){

    const command = read.createInterface({
        input: process.stdin,
        output: process.stdout,
    });


    console.log('🤖: Olá ! Aguarde um pouco enquanto preparo tudo. \n')

    try{

        await gpt.initSession();

    }catch(err){

        if( err instanceof ChatGPTError ){

            console.log('🤖: Parece que os servidores do ChatGPT estão sobrecarregados no momento. Irei tentar novamente');

            return initialize();


        }

        console.log('🤖: Ocorreu um erro durante a minha preparação.\nPor favor, informe o diretório atual do seu chrome na variável de ambiente chamada "CHROME_PATH"');

        throw new BotError('Erro durante a inicialização do BOT por não encontrar o diretório do navegador chrome');

    }

    function verifyName(){


        const verifyIfBotNameExists = fs.existsSync('botname.txt');

        if ( !verifyIfBotNameExists ){

            command.question('🤖: Pronto ! tudo certo.\nPara começarmos, por favor, me dê um nome ! esse nome será utilizado por mim no Whatsapp. \nQual será meu nome? \n\n', bot => {

                fs.writeFile('botname.txt', bot ,(error) => {

                    if(error){

                        console.log('🤖: Algum erro ocorreu durante a minha nomeação. \n Vamos tentar novamente');

                        return;

                    }

                    console.log(`🤖: Então eu me chamo ${bot} ! Fantástico ! \n`);

                    return verifyName();

                });

            });

        }

        if( verifyIfBotNameExists ){

            const verifySession = fs.existsSync(path.join('./localAuth/auth.key'));

            if ( verifySession ){

                console.log('🤖: Opa ! Parece que estou na ativa novamente !');

            }else{

                console.log('🤖: Acabo de perceber que ainda não estou vinculado a um Whatsapp ! Então, por favor, utilize o QrCode abaixo para me autenticar: ');

            }

            Events();

        }

    }

    verifyName();

}

initialize();
