import fs from 'fs';

import { whats } from '../providers/index.js';

import session from './Session.js';

import { IBot } from '../interfaces/IBot.js';
import { Options } from '../types/alias/Options.js';

import User from './User.js';
import Audio from './Audio.js';

import { BotOptions } from '../types/BotOptions.js';

class Bot {

    options: BotOptions;

    constructor(options: BotOptions = { audio: false, owner: undefined }){

        this.options = options;

    }


    async states( { options, user }: IBot ) {

        const name = await this.getName();

        if( user.state === 'welcome' ){

            await whats.sendMessage(user.phone,`Olá , me chamo ${name}. Sou um assistente virtual que faz uso do Chat GPT para enviar minhas respostas. \*`);

            await whats.sendMessage(user.phone,' Primeiramente, me informe o que você deseja. \n \n *1 - Criar uma Nova Sessão* \n\n *2 - Recuperar uma sessão* \n\n *3 - O que são sessões ?* \n\n *4 - Lista de comandos (Funcionam apenas após o início ou recuperação de uma sessão)*');

            user.state = 'before-select-option';

            return;

        }

        if( user.state === 'before-select-option' ){

            const validInitialMessages = ['1','2','3','4'];

            if( !validInitialMessages.includes(user.message) ){

                await whats.sendMessage(user.phone,'Por favor, escolha uma das opções válidas das quais citei a cima 😊 !');

                return

            }

            user.state = 'after-select-option';


        }

        if( user.state === 'after-select-option' ){

            (user.message as Options);

            const verifySelectedOption = {

                '1': async () => {

                    await whats.sendMessage(user.phone,'Olá, no que posso ajudar ?');

                    user.state = 'session';

                },

                '2': async () => {

                    await whats.sendMessage(user.phone,'Em desenvolvimento !');

                },

                '3': async () => {

                    whats.sendMessage(user.phone,`Sessões saõ as conversas que você manteve comigo anteriormente. Se você deseja recuperar uma antiga sessão, basta fornecer o ID dela !`);

                },

                '4': async () => {

                    await whats.sendMessage(user.phone,'Abaixo você pode ver uma lista de comandos que eu possuo ! \n\n */audio: ativado - Ativa o envio das minhas mensagens por áudio* \n\n */audio: desativado - Desativa o envio das minhas mensagens por áudio*');

                }

            }

            await verifySelectedOption[user.message]();


        }

        if( user.state === 'session' ){

            if( user.message.includes('/') ){

                await this.commands(user);

            }

            if( user.processing ){

                whats.sendMessage(user.phone,'Por favor, aguarde eu processar sua resposta antes de enviar novas mensagens !');

                return

            }


            if( !user.message.includes('/') ){


                if ( user.sessions.length === 0 ){

                    user.processing = true;

                    const { response, sessionId } = await session.createSession(user);

                    user.processing = false;

                    await whats.sendMessage(user.phone,'*Você acaba de criar uma nova sessão. Utilize o ID abaixo para eu recuperar o contexto desta sessão posteriormente:* ')

                    if( this.options.audio || !this.options.audio){

                        await whats.sendMessage(user.phone,` *${sessionId.toString()}* `);

                    }

                    if( this.options.audio ){

                       const media = await Audio.textToSpeech(response);

                       await whats.sendMessage(user.phone,media,{sendAudioAsVoice:true});

                       return;

                    }

                    whats.sendMessage(user.phone,response);

                    return;


                }

                user.processing = true;

                const theSession = await session.getSession(user);

                user.processing = false;

                if ( this.options.audio ){

                    const media = await Audio.textToSpeech(theSession!);

                    await whats.sendMessage(user.phone,media,{sendAudioAsVoice:true});

                    return;

                }

                await whats.sendMessage(user.phone,theSession!);


            }


        }

    }


    getName(){

        return new Promise(( resolve, reject ) => {

            fs.readFile('botname.txt', 'utf-8', async (error,name) => {

               if( error ) {
                reject(error)
               }

               resolve(name);

            });

        });

    }

    async commands( user: User ){


        const command = user.message as '/audio: ativado' | '/audio: desativado';

        command.toLocaleLowerCase();

        const verifyCommand = {

            '/audio: ativado': async () => {

                if( !this.options.audio ){

                    await whats.sendMessage(user.phone,'Claro ! a partir de agora irei conversar com você por áudio.');

                    this.options.audio = true;

                    return

                }

                await whats.sendMessage(user.phone,'Já estou conversando por áudio com você !');

            },

            '/audio: desativado': async () => {

                if ( this.options.audio ){

                    await whats.sendMessage(user.phone,'A conversa por áudio já está desativada !');

                    this.options.audio = false;

                    return

                }

                await whats.sendMessage(user.phone,'Conversa por áudio desativada com sucesso !');

            }

        }

        try {

            await verifyCommand[command]();

        }catch(err){

            whats.sendMessage(user.phone,"Ops ! não entendi qual comando você gostaria de executar. Deseja vizualizar a minha lista de comandos ?");

        }


    }


}

export default Bot;
