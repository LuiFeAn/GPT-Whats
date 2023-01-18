import WAWebJS, { ClientSession } from 'whatsapp-web.js';

import fs from 'fs';
import qrcode from 'qrcode-terminal';

import { whats } from '../providers/index.js';

import userRepository from '../repositories/userRepository.js';
import botRepository from '../repositories/botRepository.js';

class WhatsListener {

    onAuth( auth: ClientSession ){

        console.log(auth);

        console.log('🤖: Fui autenticado com sucesso !');

        fs.writeFile('./localAuth/auth.key','Autenticado',function(){

        });

    }

    async onMessage( message: WAWebJS.Message ) {

        const { body, id: { remote: phone }, ...rest } = message;

        const userFirstMessage = userRepository.find(phone);

        if ( !userFirstMessage ){

            userRepository.register({
                phone,
                message: body,
                state:'welcome',
                sessions:[],
                processing:false,
            });

            botRepository.create({
                owner: phone
            });



        }

        const user = userRepository.find(phone);
        const bot = botRepository.find(phone);


        if( user && bot ){

            const options = bot.getOptions();

            if ( !options.audio ){

                await whats.sendMessage(phone,'*Digitando...*');

            }else{

                await whats.sendMessage(phone,'*Gravando áudio...*');

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

        console.log('🤖: Estou pronto para uso !');

    }

}

export default new WhatsListener();
