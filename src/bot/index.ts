import { Bot } from "../types/Bot.js";
import { whats, gpt } from "../providers/index.js";

export default async function bot( { botName, options, authUser }: Bot ){

    const { message, phone } = authUser;

    const states = {

        'welcome': async function(){

            await whats.sendMessage(phone,`Olá , me chamo ${botName}. Sou um assistente virtual que faz uso do Chat GPT para responder QUALQUER coisa. \n Primeiramente, me informe o que você deseja. \n \n *1 - Criar uma Nova Sessão* \n *2 - Recuperar uma sessão* \n *3 - O que são sessões ?*`);

            authUser.state = 'before-select-option';

        },

        'before-select-option': async function(){

            const validInitialMessages = ['1','2','3'];

            if( !validInitialMessages.includes(message)){

                await whats.sendMessage(phone,'Por favor, escolha uma das opções válidas das quais citei a cima 😊 !');
                return

            }

        },

        'after-select-option': async function(){

        }

    }

    await states[authUser.state]();

}
