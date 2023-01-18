import { whats } from '../providers/index.js';

import WhatsListener from "../listeners/whatsListener.js";


async function Events() {


    whats.on('qr',WhatsListener.onQr);

    whats.on('authenticated',WhatsListener.onAuth);

    whats.on('ready',WhatsListener.onReady);

    whats.on('message',WhatsListener.onMessage);

    whats.initialize();

}

export default Events;
