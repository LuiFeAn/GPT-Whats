import gtts from 'gtts';
import fs from 'fs';
import Whatsapp from 'whatsapp-web.js';

class Audio {

    textToSpeech(text: string): Promise<Whatsapp.MessageMedia>{


        return new Promise ( ( reject, resolve ) => {

            const GTTS = new gtts(text,'pt-BR');

            const randomFileId = Math.floor(Math.random() * 23433);

            const audioName = `audio_${randomFileId}.mp3`;

            GTTS.save(audioName, async ( err: any, result: any ) => {

                if( err) {
                    return reject(err)
                }

                const media = Whatsapp.MessageMedia.fromFilePath(audioName);

                return resolve(media);


            });


        })

    }


}

export default new Audio();
