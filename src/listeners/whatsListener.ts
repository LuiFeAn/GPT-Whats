import WAWebJS, { ClientSession } from 'whatsapp-web.js';

import fs from 'fs';
import qrcode from 'qrcode-terminal';
import bot from '../bot/index.js';

import UserRepository from '../repos/user-repository.js';

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

            bot(
                {
                    options: message,
                    authUser: user,
                    botName: botName,
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
