import { ChatGPTAPIBrowser } from 'chatgpt';
import readline from 'readline';
import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function StartQuestion(){
    read.question('Você deseja que o BOT esteja disponível exclusivamente para você ou para seus contatos ? \n 1 - Meus Contatos \n 2 - Para mim \n Opção: ',insertMode);
}

StartQuestion();

async function insertMode( response ){

    const validResponses = ['1','2'];

    if( !validResponses.includes(response) ){
        console.log('🤖: Opção inválida !');
        return StartQuestion();
    }

    const mode = {
        '1': 'message',
        '2': 'message_create'
    };

    const browser = new ChatGPTAPIBrowser({
        email: process.env.CHATGPT_EMAIL,
        password: process.env.CHATGPT_PASSWORD,
        isGoogleLogin:true,
        executablePath: path.join("C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"),
    });


    console.log('🤖: Aguarde um pouco enquanto preparo tudo.')
    
    try{

        await browser.initSession();

    }catch(err){
        
        console.log('🤖: Ops ! isso está demorando mais que o normal. Mas não se preocupe, já estou trabalhando nisto');

    }
    
    const whats = new Client();

    whats.initialize();

    console.log('🤖: Pronto ! tudo certo para iniciarmos. \n Por favor, utilize o QrCode abaixo para se conectar ao seu WhatsApp: ');

    whats.on('qr', qr => qrcode.generate(qr,{
        small:true
    }));

    whats.on('authenticated', () => {

        console.log('🤖: Autenticação realizada com sucesso !')

    });

    whats.on('ready', () => {

        console.log('🤖: Estou pronto para ser utilizado !');

    });

    whats.on(mode[response],sendGPTMessage);


    async function sendGPTMessage(message){

        const { body: commandMessage } = message;

        if ( commandMessage.includes('$:')){

            async function gpt(){

               try{

                    const { response: gptResponse } = await browser.sendMessage(commandMessage);

                    await message.reply(`🤖: ${gptResponse}`);

                    await whats.sendMessage(message.from,'O que você gostaria de fazer com este resultado ? \n 1 - Criar um Arquivo \n 2 - Nada');

                    whats.on(mode[response], async ( backMessage ) => {
                        
                       const validBackMessage = ['1','2'];

                       if( !validBackMessage.includes(backMessage) ){

                            backMessage.reply('🤖: Opção inválida !');

                       }

                       const verifyBackMessage = {

                        '1': async () => {

                           await whats.sendMessage(backMessage.from,'GPT🤖:Qual tipo de arquivo você gostaria de criar ?');

                           whats.on(mode[response], ( archive ) => {

                               const validArchives = ['pdf','json','excel','js'];
                               
                               if( !validArchives.includes(archive) ){
                                   
                                   whats.sendMessage(archive.from,'GPT🤖: Formato de arquivo inválido');
       
                               }
       
                              })

                        },

                        '2': () => {

                        }

                      };

                      verifyBackMessage[backMessage];


                    });

               }catch(err){

                    whats.sendMessage(message.from,'GPT🤖: Desculpe. Houve algum erro. Tente novamente mais tarde');

               }
    
            }

            gpt();

            whats.sendMessage(message.from,`GPT🤖: Digitando...`);

        }
    }

}





