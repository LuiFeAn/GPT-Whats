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
    read.question('🤖: Você deseja que o BOT esteja disponível exclusivamente para você ou para seus contatos ? \n 1 - Meus Contatos \n 2 - Para mim \n Modo: ',insertMode);
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
        minimize:false,
    });


    console.log('🤖: Aguarde um pouco enquanto preparamos tudo.')
    
    try{

        await browser.initSession();

    }catch(err){
        
        console.log('🤖: Ops ! isso está demorando mais que o normal. Mas não se preocupe. Irei trabalhar nisso');

    }
    
    const whats = new Client();

    whats.initialize();

    console.log('🤖: Pronto ! tudo certo para iniciarmos. \n Por favor, utilize o QrCode abaixo para se conectar ao WhatsApp: ');

    whats.on('qr', qr => qrcode.generate(qr,{
        small:true
    }));

    whats.on('authenticated', () => console.log('🤖: Autenticação realizada com sucesso !'));

    whats.on('ready', () => console.log('🤖: Estou pronto para ser utilizado !'));

    whats.on(mode[response],sendGPTMessage);


    async function sendGPTMessage(message){

        const { body: commandMessage } = message;

        if ( commandMessage.includes('-*')){

            async function gpt(){

               try{

                    const { response } = await browser.sendMessage(commandMessage);

                    await message.reply(`🤖: ${response}`);

               }catch(err){

                    whats.sendMessage(message.from,'🤖: Desculpe. Algum erro ocorreu durante minha digitação 🥲.');

               }
    
            }

            gpt();

            whats.sendMessage(message.from,`🤖: Aguarde um instante. Pode não parecer, mas estou digitando 😁`);

        }
    }

}





