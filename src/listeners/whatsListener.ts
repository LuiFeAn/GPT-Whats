import WAWebJS, { ClientSession } from 'whatsapp-web.js';

import fs from 'fs';
import qrcode from 'qrcode-terminal';

import UserRepository from '../repos/userRepo.js';

import Bot from '../bot/Bot.js';

class WhatsListener {

    onAuth( auth: ClientSession ){

        console.log('🤖: Fui autenticado com sucesso ! \n');

        fs.writeFile('./localAuth/auth.key','Autenticado',function(){

        });

    }

    async onMessage( message: WAWebJS.Message, botName: string ){

        const { body, id: { remote: phone } } = message;

        const userExists = UserRepository.find(phone);

        if ( !userExists ){

            UserRepository.register({
                phone,
                message: body,
                state:'welcome'
            });


        }

        const user = UserRepository.find(phone);

        if( user ){

            user.message = body;

            Bot.states(
                {
                    options: message,
                    user
                }
            );

        }

    }

    onQr( qrCode: string ){

        qrcode.generate(qrCode,{
            small:true,
        });

    }

    onReady(){

        console.log('🤖: Estou pronto para uso ! \n');

    }

}

export default new WhatsListener();
