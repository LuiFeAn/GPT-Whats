import WAWebJS, { ClientSession } from 'whatsapp-web.js';

import fs from 'fs';
import qrcode from 'qrcode-terminal';
import bot from '../bot/index.js';

import UserRepository from '../repos/user-repository.js';

class WhatsListener {

    onAuth( auth: ClientSession ){

        console.log('🤖: Autenticado com sucesso !');

        fs.writeFile('./localAuth/auth.key','Autenticado',function(){

        });

    }

    onMessage( message: WAWebJS.Message ){

        const { body, id: { remote: phone } } = message;

        const userAlreadyExists = UserRepository.find(phone);

        if ( !userAlreadyExists ){

            UserRepository.register({
                phone,
                message: body,
                state:'welcome'
            });

        }

        const currentUser = UserRepository.find(phone);

        if( currentUser ){

            currentUser.message = body;

            bot(
                {
                    messageOptions: message,
                    authUser: currentUser,
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

        console.log('🤖: Estou pronto para uso !');

    }

}

export default new WhatsListener();
