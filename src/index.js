import { ChatGPTAPIBrowser } from 'chatgpt';
import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import dotenv from 'dotenv';

dotenv.config();

const whats = new Client();

const browser = new ChatGPTAPIBrowser({
    email: process.env.CHATGPT_EMAIL,
    password: process.env.CHATGPT_PASSWORD,
    isGoogleLogin:true,
});

async function StartBot(){
    
    console.log('🤖: Aguarde um pouco enquanto preparo tudo.')
    
    try{
    
        await browser.initSession();
    
    }catch(err){
        
        console.log('🤖: Ops ! isso está demorando mais que o normal. Mas não se preocupe, já estou trabalhando nisto');
    
    }
    
    
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

    let flux = 'welcome-user';

    let converId = '';


    whats.on('message', async message => {

        const { body } = message;

        const verifyFlux = {
        
            'welcome-user': async () => {
    
                await whats.sendMessage(message.from,'Olá, me chamo K$T. Sou um assistente virtual que faz uso do Chat GPT para responder QUALQUER coisa. \n Primeiramente, me informe o que você deseja. \n 1 - Criar uma Nova Sessão \n 2 - Recuperar uma sessão \n 3 - O que são sessões ?');
    
                flux = 'choice-option';
    
            },
    
            'choice-option': async () => {
    
                const validInitialMessages = ['1','2','3'];
        
                if( !validInitialMessages.includes(body) ){
        
                    await whats.sendMessage(message.from,'Por favor, escolha uma das opções válidas das quais citei a cima 😊 !');
                    return
        
                }
        
                flux = 'handle-with-choice-option';
    
            },
    
            'handle-with-choice-option': async () => {
    
                const verifyChoiceOption = {
    
                    '1': async () => {

                        await whats.sendMessage(message.from,'Aguarde enquanto estou criando uma nova sessão !');

                        const { conversationId } = await browser.sendMessage('...');

                        await whats.sendMessage(message.from,`Sessão criada com sucesso. Segue abaixo o ID da sua sessão:`);

                        await whats.sendMessage(message.from,`*${conversationId}*`);

                        converId = conversationId;

                        await whats.sendMessage(message.from,'Utilize este ID caso queria recuperar esta sessão futuramente');

                        await whats.sendMessage(message.from,'No que eu posso ajudar ?');

                        flux = 'make-a-question';



                    },

                    '2': async () => {

                        await whats.sendMessage(message.from,'Por favor, envie o código da sessão ao qual você deseja recupear');

                    },

                    '3': async () => {

                        await whats.sendMessage(message.from,'Sessões são como uma determinada conversa da qual você manteve comigo antes. Pense como se fosse um chat com várias mensagens sobre um determinado assunto 😆');

                        flux = 'choice-option';

                    }

                }

                verifyChoiceOption[body]();

            },

            'make-a-question': async () => {

                async function sending(){

                   try{

                        const { response } = await browser.sendMessage(body,{
                            conversationId: converId
                        });

                        await whats.sendMessage(message.from,response);

                   }catch(err){

                        await whats.sendMessage(message.from,'Ops ! ocorreu algum erro e não pude obter sua resposta. Tente novamente mais tarde');

                   }

                }
                
                sending();

                whats.sendMessage(message.from,'Digitando...');

            }
    
    
        }
    
        verifyFlux[flux]();

    });


}

StartBot();



