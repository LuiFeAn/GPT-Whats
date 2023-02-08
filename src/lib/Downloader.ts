import fs from 'fs';
import ytdl from 'ytdl-core';

import { v4 } from 'uuid';
import path from 'path';

import Whatsapp from 'whatsapp-web.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


class Downloader {


    static async youtubeDownload(link: string): Promise<Whatsapp.MessageMedia> {


        const id = v4();

        const file = path.join(__dirname,'../../',`/media/${id}.mp4`);

        return await new Promise( ( resolve, reject ) => {

            const ok = ytdl(link)
            .pipe(fs.createWriteStream(file));

            ok.on('finish', () => {

                const media = Whatsapp.MessageMedia.fromFilePath(file);

                resolve(media);

            });

            ok.on('error', error => reject(error) );


        });


    }



}

export default Downloader;
