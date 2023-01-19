
export interface IBotInstance {

    owner: string
}

import Bot from "../classes/Bot.js";
import { bots } from "../database/index.js";

class BotRepository {

    create({owner}: IBotInstance){

        const bot = new Bot({
            audio:false,
            owner,
        });

        bots.push(bot);

    }

    find(owner: string){

        const bot = bots.find( bot => bot.options.owner === owner );

        return bot;

    }

}

export default new BotRepository();
