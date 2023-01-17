import WAWebJS, { ClientSession } from 'whatsapp-web.js';

import fs from 'fs';
import qrcode from 'qrcode-terminal';

import { whats } from '../providers/index.js';

import UserRepository from '../repositories/userRepository.js';

import { bot } from '../providers/index.js';

class WhatsListener {

    onAuth( auth: ClientSession ){

        console.log('🤖: Fui autenticado com sucesso ! \n');

        fs.writeFile('./localAuth/auth.key','Autenticado',function(){

        });

    }

    async onMessage( message: WAWebJS.Message, botName: string ){

        const { body, id: { remote: phone } } = message;

        const options = bot.getOptions();

        if ( !options.audio ){

            await whats.sendMessage(phone,'*Digitando...*');

        }else{

            await whats.sendMessage(phone,'*Gravando áudio*');

        }

        const userExists = UserRepository.find(phone);

        if ( !userExists ){

            UserRepository.register({
                phone,
                message: body,
                state:'welcome',
                sessions:[],
                processing:false,
            });


        }

        const user = UserRepository.find(phone);

        if( user ){

           user.message = body;

            bot.states(
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
