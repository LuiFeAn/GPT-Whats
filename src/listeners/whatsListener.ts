import WAWebJS, { ClientSession } from 'whatsapp-web.js';

import fs from 'fs';
import qrcode from 'qrcode-terminal';

import { whats } from '../providers/index.js';

import UserRepository from '../repositories/userRepository.js';

import { bot } from '../providers/index.js';
import userRepository from '../repositories/userRepository.js';

class WhatsListener {

    onAuth( auth: ClientSession ){

        console.log('🤖: Fui autenticado com sucesso ! \n');

        fs.writeFile('./localAuth/auth.key','Autenticado',function(){

        });

    }

    async onMessage( message: WAWebJS.Message ) {

        const { body, id: { remote: phone }, ...rest } = message;

        const userFirstMessage = UserRepository.find(phone);

        if ( !userFirstMessage ){

            UserRepository.register({
                phone,
                message: body,
                state:'welcome',
                sessions:[],
                processing:false,
            });

        }

        const user = userRepository.find(phone);

        if( user ){

            const options = bot.getOptions();

            if ( !options.audio ){

                await whats.sendMessage(phone,'*Digitando...*');

            }else{

                await whats.sendMessage(phone,'*Gravando áudio*');

            }

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
