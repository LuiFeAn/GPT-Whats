
import { whats } from '../providers/index.js';
import { BotOptions } from '../types/BotOptions.js';

import User from './User.js';
import Audio from './Audio.js';
import session from './Session.js';

import configs from '../configs/index.js';

class Bot {

    owner: User
    botName!: string
    private options: BotOptions;

    constructor(owner: User ,options: BotOptions = { audio: false, language: 'pt-br' }){

        this.owner = owner;
        this.options = options;


    }


    async states() {

        const verifyState = {

            'welcome': async () => {

                await this.say('Primeiramente, por favor, me dê um nome 😎');

                await this.say('Qual nome você gostaria de me dar ? 👀');

                this.owner.state = 'choice-bot-name';

            },

            'choice-bot-name':  async () => {

                this.botName = this.owner.message;

                await this.say(`Ótimo ! me chamo ${this.botName}. Obrigado por me nomear ❤`);

                await this.say('Primeiramente, gostaria de informar que sou um assistente virtual que faz uso do Chat GPT para enviar minhas respostas.');

                this.say("Me informe o que você deseja. \n \n *1 - Criar uma Nova Sessão* \n\n *2 - Recuperar uma sessão* \n\n *3 - O que são sessões ?* \n\n *4 - Lista de comandos (Funcionam apenas após o início ou recuperação de uma sessão)*");

                this.owner.state = 'select-option';

            },

            'select-option': async () => {

                const validInitialMessages = ['1','2','3','4'];

                if( !validInitialMessages.includes(this.owner.message) ){

                   await this.say('Por favor, escolha uma das opções válidas das quais citei a cima 😊 !');

                   return

                }

                const verifySelectedOption = {

                    '1': async () => {

                        await this.say('Olá, no que posso ajudar ? 😆');

                        this.owner.state = 'session';

                    },

                    '2': async () => {

                        if( !configs.connectionWithDb ){

                            await this.say('Não estou conectado a um banco de dados propriamente dito no momento. Tente novamente mais tarde !');

                            return;

                        }

                        this.owner.state = 'find-session';

                    },

                    '3': async () => {

                        await this.say(`Sessões são as conversas que você manteve comigo anteriormente. Se você deseja recuperar uma antiga sessão, basta fornecer o ID dela ! 😜`);

                    },

                    '4': async () => {

                        await this.say('Abaixo você pode ver uma lista de comandos que eu possuo ! \n\n */audio: ativado - Ativa o envio das minhas mensagens por áudio* \n\n */audio: desativado - Desativa o envio das minhas mensagens por áudio*');

                    }

                }

                return await verifySelectedOption[this.owner.message]();

            },

            'session': async () => {

                if( !this.options.audio ){

                    await this.say('*Digitando...*');

                }

                if( configs.responseProcessing ){

                    await this.say('Por favor, aguarde. No momento estou processando uma resposta.\nIsso se dá porquê a OpenIA só me permite responder uma mensagem por vez. ✌');

                    return

                }

                if( this.owner.message[0] === '/' ){

                    await this.commands(this.owner.message);

                    return;

                }

                let botResponse: any;

                if( !this.owner.message.includes('/') ){

                    try {


                        if( this.owner.sessions.length === 0 ){

                            configs.responseProcessing = true;

                            const { text, sessionId } = await session.createSession(this.owner);

                            configs.responseProcessing = false;

                            await this.say('*Você acaba de criar uma nova sessão. Utilize o ID abaixo para eu recuperar o contexto desta sessão posteriormente:* ');

                            await this.say(`*${sessionId.toString()}*`);

                            botResponse = text;

                            this.say(botResponse);

                            return

                        }

                        if( this.owner.sessions.length > 0 ){

                            configs.responseProcessing = true;

                            botResponse = await session.getSession(this.owner);

                            configs.responseProcessing = false;

                            this.say(botResponse);

                            return


                        }


                    }catch(err){

                        const { statusCode } = err as { statusCode: number };

                        if( statusCode === 429 ){

                            await this.say('Parece que no momento os servidores da OpenIA estão sobrecarregados. Por favor, tente movamente mais tarde ! 💕')

                            return

                        }

                        await this.say('Algum erro ocorreu durante o envio da sua resposta. Tente novamente mais tarde !');



                    }finally{

                        configs.responseProcessing = false;

                    }


                }

            },

            'lenguage-choice': async () => {

                const validLenguages = ['pt-br','en-us'];

                if( !validLenguages.includes(this.owner.message.toLowerCase()) ){

                    this.say('A linguagem selecionada é inválida !');

                    return;

                }

                await this.say(`Ótimo ! irei responder você em ${this.owner.message}`)

                this.options.language = this.owner.message;

                this.owner.state = 'session';

            },

            'find-session': async () => {

                // const session = await sessionService.findSession(this.owner.message);

                await this.say('Esta funcionalidade está em desenvolvimento');

                this.owner.state = 'session';

                return;

            }

        }

        verifyState[this.owner.state]();


    }


    async say(message: string){

        try{

            if( this.options.audio ){

                const media = await Audio.textToSpeech(message,this.options.language!);

                await whats.sendMessage(this.owner.phone,media,{
                    sendAudioAsVoice: true
                });

                return;

            }

            await whats.sendMessage(this.owner.phone,message);


        }catch(error){

            await whats.sendMessage(this.owner.phone,'No momento não foi possível responder a sua mengagem, Por favor, tente novamente mais tarde');

            return this.states();

        }

    }

    async commands(message: string){


        (message as '/audio: ativado' | '/audio: desativado');

        message.toLocaleLowerCase();

        const verifyCommand = {

            '/audio: ativado': async () => {

                if( !this.options.audio ){

                    await this.say('Claro ! a partir de agora irei conversar com você por áudio 😜');

                    await this.say('Primeiramente, em qual idioma você gostaria que eu adaptase meu sotaque ? \nÉ interessante que você escolha meu sotaque, pois você poderá treinar a escuta de um determinado idoma através das minhas respostas 😁');

                    await this.say('Lista de idiomas:\n*PT-BR* \n*EN-US*');

                    this.owner.state = 'lenguage-choice';

                    this.options.audio = true;

                    return

                }

                await this.say('Já estou conversando por áudio com você !');

            },

            '/audio: desativado': async () => {

                if ( this.options.audio ){

                    await this.say('Conversa por áudio desativada com sucesso !');

                    this.options.audio = false;

                    return

                }

                await this.say('A conversa por áudio já está desativada !');


            },



        }

        try {

            await verifyCommand[message]();

        }catch(err){

            this.say("Ops ! não entendi qual comando você gostaria de executar. Deseja vizualizar a minha lista de comandos ?");

        }


    }


}

export default Bot;
