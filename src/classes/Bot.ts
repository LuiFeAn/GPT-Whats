import fs from 'fs';

import { whats } from '../providers/index.js';

import session from './Session.js';

import { Options } from '../types/alias/Options.js';

import User from './User.js';
import Audio from './Audio.js';

import { BotOptions } from '../types/BotOptions.js';
import Whatsapp from 'whatsapp-web.js';

class Bot {

    owner: User
    options: BotOptions;

    constructor(owner: User ,options: BotOptions = { audio: false }){

        this.owner = owner
        this.options = options;


    }


    async states() {

        const name = await this.getName();

        if( this.owner.state === 'welcome' ){

            this.say(`Olá , me chamo ${name}. Sou um assistente virtual que faz uso do Chat GPT para enviar minhas respostas. \*`);

            this.say("Primeiramente, me informe o que você deseja. \n \n *1 - Criar uma Nova Sessão* \n\n *2 - Recuperar uma sessão* \n\n *3 - O que são sessões ?* \n\n *4 - Lista de comandos (Funcionam apenas após o início ou recuperação de uma sessão)*");

            this.owner.state = 'before-select-option';

            return;

        }

        if( this.owner.state === 'before-select-option' ){

            const validInitialMessages = ['1','2','3','4'];

            if( !validInitialMessages.includes(this.owner.message) ){

               await this.say('Por favor, escolha uma das opções válidas das quais citei a cima 😊 !');

               return

            }

            this.owner.state = 'after-select-option';


        }

        if( this.owner.state === 'after-select-option' ){

            (this.owner.message as Options);

            const verifySelectedOption = {

                '1': async () => {

                    await this.say('Olá, no que posso ajudar ?');

                    this.owner.state = 'session';

                },

                '2': async () => {

                   await this.say('Em desenvolvimento !');

                },

                '3': async () => {

                    await this.say(`Sessões saõ as conversas que você manteve comigo anteriormente. Se você deseja recuperar uma antiga sessão, basta fornecer o ID dela !`);

                },

                '4': async () => {

                    await this.say('Abaixo você pode ver uma lista de comandos que eu possuo ! \n\n */audio: ativado - Ativa o envio das minhas mensagens por áudio* \n\n */audio: desativado - Desativa o envio das minhas mensagens por áudio*');

                }

            }

            await verifySelectedOption[this.owner.message]();


        }

        if( this.owner.state === 'session' ){

            if( this.owner.message.includes('/') ){

                await this.commands(this.owner.message);

            }

            if( this.owner.processing ){

                await this.say('Por favor, aguarde eu processar sua resposta antes de enviar novas mensagens !');

                return

            }


            if( !this.owner.message.includes('/') ){


                if ( this.owner.sessions.length === 0 ){

                    this.owner.processing = true;

                    const { response, sessionId } = await session.createSession(this.owner);

                    this.owner.processing = false;

                    await this.say('*Você acaba de criar uma nova sessão. Utilize o ID abaixo para eu recuperar o contexto desta sessão posteriormente:* ');

                    if( this.options.audio || !this.options.audio){

                        await this.say(`*${sessionId.toString()}*`);

                    }

                    if( this.options.audio ){

                       const media = await Audio.textToSpeech(response);

                       await this.say(media,{
                            hasAudio: true
                       })

                       return;

                    }

                    await this.say(response);

                    return;


                }

                this.owner.processing = true;

                const theSession = await session.getSession(this.owner);

                this.owner.processing = false;

                if ( this.options.audio ){

                    const media = await Audio.textToSpeech(theSession!);

                    await this.say(media,{
                        hasAudio: true
                    });

                    return;

                }

                await this.say(theSession!);

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

    say(message: string | Whatsapp.MessageMedia, options = { hasAudio: false }){

        return whats.sendMessage(this.owner.phone,message,{
            sendAudioAsVoice: options.hasAudio
        });

    }

    async commands(message: string){


        (message as '/audio: ativado' | '/audio: desativado');

        message.toLocaleLowerCase();

        const verifyCommand = {

            '/audio: ativado': async () => {

                if( !this.options.audio ){

                   await this.say('Claro ! a partir de agora irei conversar com você por áudio.')

                    this.options.audio = true;

                    return

                }

                await this.say('Já estou conversando por áudio com você !');

            },

            '/audio: desativado': async () => {

                if ( this.options.audio ){

                    await this.say('A conversa por áudio já está desativada !');

                    this.options.audio = false;

                    return

                }

                await this.say('Conversa por áudio desativada com sucesso !');

            }

        }

        try {

            await verifyCommand[message]();

        }catch(err){

            this.say("Ops ! não entendi qual comando você gostaria de executar. Deseja vizualizar a minha lista de comandos ?");

        }


    }


}

export default Bot;
