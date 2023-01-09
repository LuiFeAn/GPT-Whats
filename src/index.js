import { ChatGPTAPIBrowser } from 'chatgpt';
import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import dotenv from 'dotenv';

dotenv.config();

async function Start(){

    const browser = new ChatGPTAPIBrowser({
        email: process.env.CHATGPT_EMAIL,
        password: process.env.CHATGPT_PASSWORD,
        isGoogleLogin:true,
    });

    console.log('🤖: Aguarde um pouco enquanto preparamo tudo.')
    
    await browser.initSession();

    const whats = new Client();

    whats.initialize();

    console.log('🤖: Pronto ! tudo certo para iniciarmos. \n Por favor, utilize o QrCode abaixo para se conectar ao WhatsApp: ');

    whats.on('qr', qr => qrcode.generate(qr,{
        small:true
    }));

    whats.on('authenticated', () => console.log('🤖: Autenticação realizada com sucesso !'));

    whats.on('ready', () => console.log('🤖: Estou pronto para ser utilizado !'));

    whats.on('message_create',sendGPTMessage);


    async function sendGPTMessage(message){

        const { body: commandMessage } = message;

        if ( commandMessage.includes('-*')){

            async function gpt(){

               try{

                    const { response } = await browser.sendMessage(commandMessage);

                    await message.reply(`🤖: ${response}`);

               }catch(err){

                    whats.sendMessage(message.from,'🤖: Desculpe. Algum erro ocorreu 🥲. Tente novamente mais tarde, ok ? 😊');

               }
    
            }

            gpt();

            whats.sendMessage(message.from,`🤖: Aguarde um instante. Pode não parecer, mas estou digitando 😁👽`);

        }
    }


}

Start();





