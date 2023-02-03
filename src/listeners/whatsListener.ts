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

        const sessions = await sessionService.findSessions(phone);

        if ( sessions.length === 0 ){

            const user = userRepository.register({
                phone,
                message: body,
            });

            botRepository.create({
                owner: user
            });


        }


        const user = userRepository.find(phone);

        user!.sessions = sessions;

        const bot = botRepository.find(phone);

        if( hasMedia ){

            await bot!.say('Infelizmente não consigo reconhecer mensagens multimídia. Por favor, envie apenas textos ! 😁');

            return;

        }

       if( bot && user ){

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
