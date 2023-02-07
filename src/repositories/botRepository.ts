import User from "../lib/User.js";

export interface IBotInstance {

    owner: User
}

import Bot from "../lib/Bot.js";
import { bots } from "../database/index.js";

class BotRepository {

    create( { owner } : IBotInstance){

        const bot = new Bot(owner);

        bots.push(bot);

    }

    find(ownerNumber: string){

        const bot = bots.find( bot => bot.owner.phone === ownerNumber );

        return bot;

    }

}

export default new BotRepository();
