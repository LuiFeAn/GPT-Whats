import WAWebJS from "whatsapp-web.js";

import User from "../entity/User.js";
import bot from "../bot/index.js";

import { users } from "../index.js";

export default async function onMessage(command: WAWebJS.Message){

    const { body, id: { remote: phone } } = command;

    const userAlreadyExists = users.find( user => user.phone === phone);

    if ( !userAlreadyExists ){

        users.push(new User(
            {
                phone,
                message: body,
                state:'welcome'
            }
        ));

    }

    const currentUser = users.find( user => user.phone === phone );

    if( currentUser ){

        currentUser.message = body;

        bot(
            {
                messageOptions: command,
                userMessage: currentUser.message,
                state: currentUser.state,
            }
        );

    }
}