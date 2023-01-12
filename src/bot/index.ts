import { Bot } from "../types/Bot.js";

import { whats, gpt } from "../index.js";

export default async function bot( { messageOptions, authUser }: Bot ){

    const { message } = authUser;

    const states = {

        'welcome': async function(){

            await whats.sendMessage(message,`Olá , me chamo K$T. Sou um assistente virtual que faz uso do Chat GPT para responder QUALQUER coisa. \n Primeiramente, me informe o que você deseja. \n \n *1 - Criar uma Nova Sessão* \n *2 - Recuperar uma sessão* \n *3 - O que são sessões ?*`);

            authUser.state = 'before-select-option';

        },

        'before-select-option': async function(){

            const validInitialMessages = ['1','2','3'];
            
            if( !validInitialMessages.includes(message)){
    
                await whats.sendMessage(message,'Por favor, escolha uma das opções válidas das quais citei a cima 😊 !');
                return
    
            }

        },

        'after-select-option': async function(){

        }

    }

    await states[authUser.state]();

}