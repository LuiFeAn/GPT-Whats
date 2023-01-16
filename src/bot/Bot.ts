import fs from 'fs';
import read from 'readline';
import util from 'util';

import { TextToSpeechClient } from '@google-cloud/text-to-speech';

import { whats, gpt } from '../providers/index.js';

// import gTTs from 'gtts';

import * as wtMedia from 'whatsapp-web.js';

import session from '../session/index.js';

import { IBot } from '../interfaces/IBot.js';
import { IUser } from '../interfaces/IUser.js';

const command = read.createInterface({
    input: process.stdin,
    output: process.stdout,
});


type BotOptions = {

    audio: boolean

}


class Bot {

    private options;

    constructor(options: BotOptions){

        this.options = options;

    }


    states( { options, user }: IBot ){

        const commands = this.commands;

        const botOptions = this.options;

        fs.readFile('botname.txt', 'utf-8', async function(error,name) {

            const { message, phone } = user;

            const states = {

                'welcome': async function(){

                    await whats.sendMessage(phone,`Olá , me chamo ${name}. Sou um assistente virtual que faz uso do Chat GPT para enviar minhas respostas. \*`);

                    await whats.sendMessage(phone,' Primeiramente, me informe o que você deseja. \n \n *1 - Criar uma Nova Sessão* \n *2 - Recuperar uma sessão* \n *3 - O que são sessões ?*')

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

                            return

                        },

                        '3': function(){

                            whats.sendMessage(phone,`Sessões saõ as conversas que você manteve comigo anteriormente. Se você deseja recuperar uma antiga sessão, basta fornecer o ID dela !`);

                            return;

                        }

                    }

                    selectedOption[option]();

                },

                'session': async function(){


                    if ( user.sessions.length === 0 ){

                        session.createSession(user);

                        return;


                    }

                    await commands(user, botOptions);

                    if( !message.includes('/') ){

                        const theSession = await session.getSession(user);

                        if ( botOptions.audio ){

                            await whats.sendMessage(phone,'No momento infelizmente ainda não posso enviar mensagens por áudio. Mas fique atento a novas atualizações !');

                        }

                        await whats.sendMessage(phone,theSession!);


                    }


                },


            }

            await states[user.state]();

        });


    }

    getOptions(){

        return this.options;

    }

    async commands( user: IUser, options: BotOptions ){

        const { phone, message } = user;

        const command = message as '/converse comigo por audio' | '/desativar conversa por áudio';

        command.toLocaleLowerCase();

        const verifyCommand = {

            '/converse comigo por audio': async function(){

                if( !options.audio ){

                    await whats.sendMessage(phone,'Claro ! a partir de agora irei conversar com você por áudio.');

                    options.audio = true;

                    return

                }

                await whats.sendMessage(phone,'Já estou conversando por áudio com você !');

            },

            '/desativar conversa por áudio': async function(){

                if ( !options.audio ){

                    await whats.sendMessage(phone,'A conversa por áudio já está desativada !');

                    options.audio = false;

                    return

                }

                await whats.sendMessage(phone,'Conversa por áudio desativada com sucesso !');

            }

        }

        try {

            await verifyCommand[command]();

        }catch(err){

            return;

        }


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

export default Bot;
