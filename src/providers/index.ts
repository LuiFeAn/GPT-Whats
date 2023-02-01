import { ChatGPTAPI } from 'chatgpt';
import Whatsapp from 'whatsapp-web.js';

import dotenv from 'dotenv';

dotenv.config();

export const gpt = new ChatGPTAPI({
    apiKey: process.env.OPENAI_KEY as string
});

export const whats = new Whatsapp.Client({
    authStrategy: new Whatsapp.LocalAuth({
        dataPath:'./localAuth'
    }),
});




