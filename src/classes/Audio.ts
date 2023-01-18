
import gtts from 'gtts';
import Whatsapp from 'whatsapp-web.js';

class Audio {

    textToSpeech(text: string,callback:Function){

        const GTTS = new gtts(text,'pt-BR');

        const randomFileId = Math.floor(Math.random() * 23433);

        GTTS.save(`output-${randomFileId}.mp3`, async ( err: any, result: any ) => {

            const media = Whatsapp.MessageMedia.fromFilePath(`output-${randomFileId}.mp3`);

            callback(media);

        });

    }


}

export default new Audio();
