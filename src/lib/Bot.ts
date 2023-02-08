
import { whats } from '../providers/index.js';
import { BotMemory, BotOptions } from '../types/BotOptions.js';

import validUUID from '../utils/validUUID.js';

import User from './User.js';
import Audio from './Audio.js';
import session from './Session.js';

import configs from '../global/configs/index.js';
import sessionService from '../services/sessionService.js';

import Downloader from './Downloader.js';

import Whatsapp from 'whatsapp-web.js';

class Bot {

    owner: User
    private options: BotOptions;
    private memory: BotMemory
    private lenguages: string []
    private connected: boolean

    constructor(owner: User ,options: BotOptions = { audio: false, language: 'pt-br' }){

        this.owner = owner;
        this.options = options;
        this.memory = {
            session_name:'',
            newSession:false,
        }
        this.lenguages = ['pt-br','en-us'];
        this.connected = false;


    }


    async states() {

        const verifyState = {

            'welcome': async () => {

                await this.say('Olá. me chamo Wrench. Sou um assistente virtual que faz uso do Chat GPT para enviar minhas respostas.');

                this.say("Me informe o que você deseja. \n \n *1 - Criar uma Nova Sessão* \n\n *2 - Recuperar uma sessão* \n\n *3 - O que são sessões ?* \n\n *4 - Sessões anteriores* \n\n *5 - Lista de comandos*");

                this.owner.state = 'select-option';
            },

            'select-option': async () => {

                const validInitialMessages = ['1','2','3','4','5'];

                if( !validInitialMessages.includes(this.owner.message) ){

                    return await this.say('Por favor, escolha uma das opções válidas das quais citei a cima 😊 !');

                }

                const verifySelectedOption = {

                    '1': async () => {

                        await this.say('Primeiramente, por favor, dê um nome a esta sessão.\n Dar um nome a uma sessão é importante para que posteriormente você saiba exatamente qual era o contexto de uma possível sessão anterior.');

                        this.memory.newSession = true;

                        this.owner.state = 'choice-session-name';

                    },


                    '2': async () => {

                        if( !configs.connectionWithDb ){

                            return await this.say('Não estou conectado a um banco de dados propriamente dito no momento. Tente novamente mais tarde !');

                        }

                        await this.say('Certo. Me informe o ID da sessão que deseja recupear')

                        this.owner.state = 'find-session';

                    },

                    '3': async () => {

                        await this.say(`Sessões são as conversas que você manteve comigo anteriormente. Se você deseja recuperar uma antiga sessão, basta fornecer o ID dela ! 😜`);

                    },

                    '4': async () => {

                        if( this.owner.sessions.length === 0 ){

                            return await this.say('Você não possui nenhuma sessão no momento.');

                        }

                        await this.say('Essas são todas as suas sessões existentes:')

                        this.owner.sessions.forEach( async session => {


                            await this.say(`*Nome: ${session.session_name.toUpperCase()}* *\nID desta sessão*`);

                            await this.say(`${session.session_id}`);


                        });


                    },

                    '5': async () => {

                        await this.say('Abaixo você pode ver uma lista de comandos que eu possuo ! \n\n */audio: ativado - Ativa o envio das minhas mensagens por áudio* \n\n */audio: desativado - Desativa o envio das minhas mensagens por áudio* \n\n */mudar idioma - Você poderá escolher em qual sotaque deseja que eu envie áudios* \n\n */voltar ao início Se estiver em uma sessão, você poderá escolher novamente qual opção deseja* \n\n Observação: \n *Certifique-se de que o comando selecionado esteja escrito exatamente como foi listado. Do contrário, poderei não entender o que você deseja*');


                    }

                }

                return await verifySelectedOption[this.owner.message]();

            },

            'choice-session-name': async () => {

                await this.say(`Ótimo ! esta sessão foi nomeada como ${this.owner.message}`);

                this.memory.session_name = this.owner.message;

                await this.say('Olá ! como posso ajudar você hoje ? ✌️')

                this.owner.state = 'session';

            },

            'session': async () => {

                if( !this.options.audio ){

                    await this.say('*Digitando...*');

                }

                if( configs.responseProcessing ){

                    return await this.say('Por favor, aguarde. No momento estou processando uma resposta.\nIsso se dá porquê a OpenIA só me permite responder uma mensagem por vez. ✌');

                }

                let botResponse: any;

                if( !this.owner.message.includes('/') ){

                    try {


                        if( this.memory.newSession ){

                            configs.responseProcessing = true;

                            const { text, sessionId } = await session.createSession(this.owner,this.memory.session_name);

                            this.connected = true;

                            configs.responseProcessing = false;

                            await this.say('*Você acaba de criar uma nova sessão. Utilize o ID abaixo para eu recuperar o contexto desta sessão posteriormente:* ');

                            await this.say(`${sessionId.toString()}`);

                            botResponse = text;

                            await this.say(botResponse);

                            this.memory.newSession = false;

                            return

                        }

                        if( !this.memory.newSession ){

                            configs.responseProcessing = true;

                            botResponse = await session.getSession(this.owner);

                            this.connected = true;

                            configs.responseProcessing = false;

                            return await this.say(botResponse);


                        }


                    }catch(err){

                        const { statusCode } = err as { statusCode: number };

                        this.connected = false;

                        if( statusCode === 429 ){

                            return await this.say('Parece que no momento os servidores da OpenIA estão sobrecarregados. Por favor, tente movamente mais tarde ! 💕')

                        }

                        await this.say('Algum erro ocorreu durante o envio da sua resposta. Tente novamente mais tarde !');



                    }finally{

                        configs.responseProcessing = false;

                    }


                }

            },

            'lenguage-choice': async () => {

                if( !this.lenguages.includes(this.owner.message.toLowerCase()) ){

                    return await this.say('A linguagem selecionada é inválida !');

                }

                await this.say(`Ótimo ! irei responder você em ${this.owner.message}`);

                this.options.language = this.owner.message;

                if( !this.connected ){

                    this.owner.state = 'select-option';

                    return await this.say('Não consegui encontrar uma conexão com os servidores da OpenIA. Logo, não posso responder suas mensagens no momento.');

                }

                this.owner.state = 'session';

            },

            'find-session': async () => {

                if( !validUUID(this.owner.message)){

                    return await this.say('Este não é um ID válido. Por favor, me força o ID correto.');

                }

                const session = await sessionService.setSessionWithCurrent(this.owner.message, this.owner.phone);

                if( !session ){

                    return await this.say('Esta sessão não existe');

                }

                await this.say(`Tudo certo ! a sessão foi recuperada`);

                this.owner.state = 'session';



            },

            'download-youtube-video': async () => {


                await this.say('Aguarde... estou processando seu vídeo');

                try {

                    const media = await Downloader.youtubeDownload(this.owner.message);

                    await this.say(media);

                }catch(err){

                    console.log(err);

                    this.owner.state = 'select-option';

                    return await this.say('Não foi possível processar seu vídeo');

                }


            }

        }

        verifyState[this.owner.state]();


    }


    async say(message: string | Whatsapp.MessageMedia ){

        try{

            if( this.options.audio && typeof message === 'string' ){

                const media = await Audio.textToSpeech(message,this.options.language!);

                return await whats.sendMessage(this.owner.phone,media,{
                    sendAudioAsVoice: true,
                });


            }

            await whats.sendMessage(this.owner.phone,message);


        }catch(error){

            await whats.sendMessage(this.owner.phone,'No momento não foi possível responder a sua mengagem, Por favor, tente novamente mais tarde');

            return this.states();

        }

    }

    async commands(message: string){

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

            '/mudar idioma': async () => {

                if( !this.options.audio ){

                    return this.say('O áudio não está ativado no momento para que eu possa trocar de idioma');

                }

                await this.say('Para qual idioma você gostaria de trocar ?');

                this.owner.state = 'lenguage-choice';



            },

            '/voltar ao início': async () => {


                if( this.owner.state === 'select-option' ){

                    return this.say('Você já está no início');

                }

                await this.say('Claro, irei votar ao início');

                this.owner.state = 'select-option';

                await this.say('Pronto ! agora você pode escolher novamente uma das opções que listei anteriormente');

            },

            '/download: youtube': async () => {

                await this.say('Por favor, me forneça o link do vídeo que você deseja baixar');

                this.owner.state = 'download-youtube-video';

            },



        }

        try {

            await verifyCommand[message]();

        }catch(err){

            await this.say("Ops ! não entendi qual comando você gostaria de executar. Deseja vizualizar a minha lista de comandos ?");

        }


    }


}

export default Bot;
