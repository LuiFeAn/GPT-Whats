import fs from 'fs';
import qrcode from 'qrcode-terminal';

import bot from '../bot/index.js';

import WAWebJS, { ClientSession } from 'whatsapp-web.js';

import User from '../classes/User.js';

import { users, gpt } from '../index.js';

class WhatsListeners {

    onAuth( auth: ClientSession ){

        console.log('🤖: Autenticado com sucesso !');

        fs.writeFile('./localAuth/auth.key','Autenticado',function(){

        });

    }

    onMessage( message: WAWebJS.Message ){

        const { body, id: { remote: phone } } = message;

        const userAlreadyExists = users.find( user => user.phone === phone);

        if ( !userAlreadyExists ){

            users.push(new User(
                {
                    phone,
                    message: body,
                    state:'welcome'
                }
            ));

        }

        const currentUser = users.find( user => user.phone === phone );

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

export default new WhatsListeners();
