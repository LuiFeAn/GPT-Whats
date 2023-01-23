import User from "../classes/User.js";

export interface IBotInstance {

    owner: User
}

import Bot from "../classes/Bot.js";
import { bots } from "../database/index.js";

class BotRepository {

    create( { owner } : IBotInstance){

        const bot = new Bot(owner,{
            audio:false,
        });

        bots.push(bot);

    }

    find(ownerNumber: string){

        const bot = bots.find( bot => bot.owner.phone === ownerNumber );

        return bot;

    }

}

export default new BotRepository();
