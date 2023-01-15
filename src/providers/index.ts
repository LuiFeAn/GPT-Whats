import { ChatGPTAPIBrowser } from "chatgpt";
import Whatsapp from 'whatsapp-web.js';

import dotenv from 'dotenv';

dotenv.config();

export const gpt = new ChatGPTAPIBrowser({
    email: process.env.CHATGPT_EMAIL as string,
    password: process.env.CHATGPT_PASSWORD as string,
    isGoogleLogin:true,
});

export const whats = new Whatsapp.Client({
    authStrategy: new Whatsapp.LocalAuth({
        dataPath:'./localAuth'
    }),
});


