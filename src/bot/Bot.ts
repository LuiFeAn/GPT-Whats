import fs from 'fs';
import read from 'readline';

import { whats, gpt } from '../providers/index.js';

import { IBot } from '../interfaces/IBot.js';

const command = read.createInterface({
    input: process.stdin,
    output: process.stdout,
});

class Bot {


    states( { options, user }: IBot ){


        fs.readFile('botname.txt', 'utf-8', async function(error,name) {

            const { message, phone } = user;

            const states = {

                'welcome': async function(){

                    await whats.sendMessage(phone,`Olá , me chamo ${name}. Sou um assistente virtual que faz uso do Chat GPT para responder QUALQUER coisa. \n Primeiramente, me informe o que você deseja. \n \n *1 - Criar uma Nova Sessão* \n *2 - Recuperar uma sessão* \n *3 - O que são sessões ?*`);

                    user.state = 'before-select-option';

                },

                'before-select-option': async function(){

                    const validInitialMessages = [
                        '1',
                        '2',
                        '3'
                    ];

                    if( !validInitialMessages.includes(message)){

                        await whats.sendMessage(phone,'Por favor, escolha uma das opções válidas das quais citei a cima 😊 !');

                        return;

                    }

                    user.state = 'after-select-option';

                },

                'after-select-option': async function(){

                    const option = user.message as '1' | '2' | '3';

                    const selectedOption = {

                        '1': async function (){


                            await whats.sendMessage(phone,'Olá, no que posso ajudar ?');

                            user.state = 'session';


                        },

                        '2': async function() {

                            await whats.sendMessage(phone,'Em desenvolvimento !');

                        },

                        '3': function(){

                            whats.sendMessage(phone,`Sessões saõ as conversas que você manteve comigo anteriormente. Se você deseja recuperar uma antiga sessão, basta fornecer o ID dela !`);

                            return;

                        }

                    }

                    selectedOption[option]();

                },

                'session': async function(){

                    await whats.sendMessage(phone,'Digitando...');


                    if ( !user.conversationId && !user.messageId ){

                        const { response, messageId, conversationId } = await gpt.sendMessage(message);

                        user.conversationId = conversationId,
                        user.messageId = messageId;

                        return await whats.sendMessage(phone,response);

                    }

                    const { response, conversationId, messageId } = await gpt.sendMessage(message,{
                        conversationId: user.conversationId,
                        parentMessageId: user.messageId
                    });

                    user.conversationId = conversationId;
                    user.messageId = messageId;

                    await whats.sendMessage(phone,response);


                },


            }

            await states[user.state]();

        });


    }


    Initialize(callback: Function){


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

            if( verifyIfBotNameExists ){

                callback();

            }

        }

        reloadThis();

    }

}

export default new Bot();
