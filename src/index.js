import { ChatGPTAPIBrowser } from 'chatgpt';
import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import dotenv from 'dotenv';

import path from 'path';

dotenv.config();

const whats = new Client();

const browser = new ChatGPTAPIBrowser({
    email: process.env.CHATGPT_EMAIL,
    password: process.env.CHATGPT_PASSWORD,
    isGoogleLogin:true,
    executablePath:path.join("C:/Program Files (x86)/Google/Chrome/Application/chrome.exe")
});

async function StartBot(){
    
    console.log('🤖: Aguarde um pouco enquanto preparo tudo.')
    
    // try{
    
    //     await browser.initSession();
    
    // }catch(err){
        
    //     console.log('🤖: Ops ! isso está demorando mais que o normal. Mas não se preocupe, já estou trabalhando nisto');
    
    // }
    
    
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
    
    //Array que irá armazenar todos os usuários que enviarem uma mensagem ao bot
    const users = [];


    whats.on('message', async message => {

        const { body, notifyName ,id: { remote } } = message;

        console.log(message);

        //Verifica se o usuário que enviou a mesnsagem já se encontra "cadastrado"
        const verifyIfUserExists = users.find( user => user.phone === remote);

        if( !verifyIfUserExists ){

            users.push({
                phone: remote,
                userMessage: body,
                flux:'welcome-user',
                memory:[]
            });
            
        }

    
        //Verifica novamente os usuários para encontrar o usuário que foi anteriormente cadastrado
        const user = users.find( user => user.phone === remote);

        //Atualiza a mensagem enviada e define ela para o usuário atual ao qual enviou a mensagem
        user.userMessage = body;

        const verifyFlux = {
        
            'welcome-user': async () => {
    
                await whats.sendMessage(message.from,`Olá ${notifyName}, me chamo K$T. Sou um assistente virtual que faz uso do Chat GPT para responder QUALQUER coisa. \n Primeiramente, me informe o que você deseja. \n \n *1 - Criar uma Nova Sessão* \n *2 - Recuperar uma sessão* \n *3 - O que são sessões ?*`);
    
                user.flux = 'choice-option';
    
            },
    
            'choice-option': async () => {
    
                const validInitialMessages = ['1','2','3'];
        
                if( !validInitialMessages.includes(user.userMessage)){
        
                    await whats.sendMessage(message.from,'Por favor, escolha uma das opções válidas das quais citei a cima 😊 !');
                    return
        
                }
        
                user.flux = 'handle-with-choice-option';
    
            },
    
            'handle-with-choice-option': async () => {
    
                const verifyChoiceOption = {
    
                    '1': async () => {

                        await whats.sendMessage(message.from,'No que eu posso ajudar ?');

                        await whats.sendMessage(message.from,'Aguarde enquanto estou criando uma nova sessão !');

                        const { conversationId, messageId } = await browser.sendMessage('...');

                        await whats.sendMessage(message.from,`Sessão criada com sucesso. Segue abaixo o ID da sua sessão:`);

                        await whats.sendMessage(message.from,`*${conversationId}*`);

                        await whats.sendMessage(message.from,'Utilize este ID caso queria recuperar esta sessão futuramente');


                        conversation = conversationId;
                        msg = messageId;

                        user.flux = 'make-a-question';



                    },

                    '2': async () => {

                        await whats.sendMessage(message.from,'Por favor, envie o código da sessão ao qual você deseja recupear');

                    },

                    '3': async () => {

                        await whats.sendMessage(message.from,'Sessões são como uma determinada conversa da qual você manteve comigo antes. Pense como se fosse um chat com várias mensagens sobre um determinado assunto 😆');

                        user.flux = 'choice-option';

                    }

                }

                verifyChoiceOption[user.userMessage]();

            },

            'make-a-question': async () => {

                async function sending(){

                   try{

<<<<<<< HEAD
                        console.log({
                            conversation,
                            msg
                        })

                        const { response } = await browser.sendMessage(body,{
                            conversationId: conversation,
                            messageId: msg
                        });
=======
                        const { response } = await browser.sendMessage(user.userMessage);
>>>>>>> 9b4c5d8894f01e2435070593c639dc07939bd9c8

                        await whats.sendMessage(message.from,response);

                   }catch(err){

                        console.log(err);
                        await whats.sendMessage(message.from,'Ops ! ocorreu algum erro e não pude obter sua resposta. Tente novamente mais tarde');

                   }

                }
                
                sending();

                whats.sendMessage(message.from,'Digitando...');

            }
    
    
        }
    
        verifyFlux[user.flux]();

    });


}

StartBot();



