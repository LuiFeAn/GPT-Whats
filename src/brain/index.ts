import fs from 'fs';
import read from 'readline';


import { whats } from '../providers/index.js';

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
    private processing;

    constructor(options: BotOptions = { audio: false }){

        this.options = options;
        this.processing = false;

    }


    states( { options, user }: IBot ){

        const { message, phone } = user;

        this.getName( async ( name: string ) => {

            if( user.state === 'welcome'){

                await whats.sendMessage(phone,`Olá , me chamo ${name}. Sou um assistente virtual que faz uso do Chat GPT para enviar minhas respostas. \*`);

                await whats.sendMessage(phone,' Primeiramente, me informe o que você deseja. \n \n *1 - Criar uma Nova Sessão* \n *2 - Recuperar uma sessão* \n *3 - O que são sessões ?*');

                user.state = 'before-select-option';

                return;

            }

            if( user.state === 'before-select-option' ){

                const validInitialMessages = ['1','2','3'];

                if( !validInitialMessages.includes(message) ){

                    await whats.sendMessage(phone,'Por favor, escolha uma das opções válidas das quais citei a cima 😊 !');

                    return

                }

                user.state = 'after-select-option';


            }

            if( user.state === 'after-select-option' ){

                const option = user.message as '1' | '2' | '3';

                const selectedOption = {

                    '1': async () => {


                        await whats.sendMessage(phone,'Olá, no que posso ajudar ?');

                        user.state = 'session';


                    },

                    '2': async () => {

                        await whats.sendMessage(phone,'Em desenvolvimento !');

                        return

                    },

                    '3': () => {

                        whats.sendMessage(phone,`Sessões saõ as conversas que você manteve comigo anteriormente. Se você deseja recuperar uma antiga sessão, basta fornecer o ID dela !`);

                        return;

                    }

                }

                selectedOption[option]();

            }

            if( user.state === 'session' ){


                if( user.processing ){

                    whats.sendMessage(phone,'Por favor, aguarde eu processar sua resposta antes de enviar novas mensagens !');

                    return

                }

                if ( user.sessions.length === 0 ){

                    user.processing = true;

                    const { response, sessionId } = await session.createSession(user);

                    user.processing = false;

                    await whats.sendMessage(phone,'*Você acaba de criar uma nova sessão. Utilize o ID abaixo para eu recuperar o contexto desta sessão posteriormente:* ')

                    await whats.sendMessage(phone,` *${sessionId.toString()}* `);

                    options.reply(phone,response);

                    return;


                }

                await this.commands(user);

                if( !message.includes('/') ){

                    user.processing = true;

                    const theSession = await session.getSession(user);

                    user.processing = false;

                    if ( this.options.audio ){

                        await whats.sendMessage(phone,'No momento infelizmente ainda não posso enviar mensagens por áudio. Mas fique atento a novas atualizações !');

                    }

                    await whats.sendMessage(phone,theSession!);


                }


            }


        });



    }

    getOptions(){

        return this.options;

    }

    getName(callback: Function){

        fs.readFile('botname.txt', 'utf-8', async (error,name) => {

            callback(name)

        });

    }

    async commands( user: IUser ){

        const { phone, message } = user;

        const command = message as '/converse comigo por audio' | '/desativar conversa por áudio';

        command.toLocaleLowerCase();

        const verifyCommand = {

            '/converse comigo por audio': async () => {

                if( !this.options.audio ){

                    await whats.sendMessage(phone,'Claro ! a partir de agora irei conversar com você por áudio.');

                    this.options.audio = true;

                    return

                }

                await whats.sendMessage(phone,'Já estou conversando por áudio com você !');

            },

            '/desativar conversa por áudio': async () => {

                if ( !this.options.audio ){

                    await whats.sendMessage(phone,'A conversa por áudio já está desativada !');

                    this.options.audio = false;

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
