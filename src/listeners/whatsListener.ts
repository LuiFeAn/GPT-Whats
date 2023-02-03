import WAWebJS from 'whatsapp-web.js';

import fs from 'fs';
import qrcode from 'qrcode-terminal';

import userRepository from '../repositories/userRepository.js';
import botRepository from '../repositories/botRepository.js';
import sessionService from '../services/sessionService.js';


class WhatsListener {

    onAuth(){

        console.log('🤖: Fui autenticado com sucesso !');

        fs.writeFile('./localAuth/auth.key','Autenticado',function(){

        });

    }

    async onMessage( message: WAWebJS.Message ) {

        let { body, id: { remote: phone }, hasMedia } = message;

        //Verifica se um usuário já existe em memória
        const verifyIfUsersExistsInMemory = userRepository.find( phone );

        // Caso não exista, registra ele em memória e cria uma nova instância do bot para este usuário
        if ( !verifyIfUsersExistsInMemory ){

            const user = userRepository.register({
                phone,
                message: body,
            });

            botRepository.create({
                owner: user
            });


        }


        //Busca o usuário criado anteriormente em memória
        const user = userRepository.find(phone);

        //Busca a instância do bot criado anteriormente em memória pelo número do usuário
        const bot = botRepository.find(phone);

        //Condidção aplicada para verificar se a mensagem do usuário foi multimídia
        if( hasMedia ){

            await bot!.say('Infelizmente não consigo reconhecer mensagens multimídia. Por favor, envie apenas textos ! 😁');

            return;

        }

       if( bot && user ){

            //Busca toas as sessões referentes a aquele usuário pelo seu número de telefone
            const sessions = await sessionService.findSessions(phone);

             //Aplica as sessões armazenadas no banco de dados às suas sessões
            user.updateSessions(sessions);

            user.message = body;

            bot.states();

        }


    }

    onQr( qrCode: string ){

        qrcode.generate(qrCode,{
            small:true,
        });

    }

    onReady(){

        console.log('🤖: Estou pronto para uso !');

    }

}

export default new WhatsListener();
