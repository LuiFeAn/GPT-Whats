import WAWebJS, { ClientSession } from 'whatsapp-web.js';

import fs from 'fs';
import qrcode from 'qrcode-terminal';

import { whats } from '../providers/index.js';

import userRepository from '../repositories/userRepository.js';
import botRepository from '../repositories/botRepository.js';

import Audio from '../classes/Audio.js';

class WhatsListener {

    onAuth( auth: ClientSession ){

        console.log('🤖: Fui autenticado com sucesso !');

        fs.writeFile('./localAuth/auth.key','Autenticado',function(){

        });

    }

    async onMessage( message: WAWebJS.Message ) {

        let { body, id: { remote: phone }, hasMedia, mediaKey, ...rest } = message;

        const userFirstMessage = userRepository.find(phone);

        if ( !userFirstMessage ){

            const user = userRepository.register({
                phone,
                message: body,
                state:'welcome',
                sessions:[],
                processing:false,
            });

            botRepository.create({
                owner: user
            });



        }

        const user = userRepository.find(phone);
        const bot = botRepository.find(phone);

        // if( hasMedia ){

        //     try{

        //         const media = await message.downloadMedia();

        //         const text = await Audio.speechToText(media);

        //         body = text;

        //     }catch(err){

        //         await bot!.say('Não foi possível compreender seu audio! Tente novamente mais tarde');

        //         return;

        //     }

        // }

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
