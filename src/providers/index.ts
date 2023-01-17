import { ChatGPTAPIBrowser } from "chatgpt";
import Whatsapp from 'whatsapp-web.js';

import path from 'path';
import dotenv from 'dotenv';

import Bot from "../brain/index.js";


dotenv.config();

export const gpt = new ChatGPTAPIBrowser({
    email: process.env.CHATGPT_EMAIL as string,
    password: process.env.CHATGPT_PASSWORD as string,
    isGoogleLogin:true,
    executablePath: process.env.CHROME_PATH ? path.join(process.env.CHROME_PATH) : undefined,
});

export const whats = new Whatsapp.Client({
    authStrategy: new Whatsapp.LocalAuth({
        dataPath:'./localAuth'
    }),
});

export const bot = new Bot({
    audio: false,
});




