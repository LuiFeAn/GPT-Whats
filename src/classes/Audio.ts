import gtts from 'gtts';
import fs from 'fs';
import Whatsapp from 'whatsapp-web.js';
import path from 'path';


import { Leopard} from '@picovoice/leopard-node';

class Audio {

    textToSpeech(text: string): Promise<Whatsapp.MessageMedia>{


        return new Promise ( ( resolve,reject ) => {

            const GTTS = new gtts(text,'pt-BR');

            const randomFileId = Math.floor(Math.random() * 23433);

            const audioName = `audio_${randomFileId}.mp3`;

            GTTS.save(audioName, async ( err: any, result: any ) => {

                if( err) {
                    reject(err)
                }

                const media = Whatsapp.MessageMedia.fromFilePath(audioName);

                fs.unlink(audioName, ( error: any ) => null);

                resolve(media);


            });


        })

    }

    async speechToText(media: Whatsapp.MessageMedia): Promise<string>{


        return new Promise(( resolve, reject ) => {

            const savedFilePath = __dirname;

            fs.writeFile(savedFilePath, JSON.stringify(media.data), function (err) {

                if( err ){

                    reject(err);

                }

                const client = new Leopard(process.env.PICOVOICE_KEY as string);

                const result = client.processFile(savedFilePath);

                resolve(result.transcript);


            });


        });

    }


}

export default new Audio();
