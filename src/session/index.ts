import { whats, gpt } from "../providers/index.js";

import { IUser } from "../interfaces/IUser.js";

class Session {

    async createSession( user: IUser ){

        const { message, phone } = user;

        const { response, messageId, conversationId } = await gpt.sendMessage(message);

        const sessionId = this.createSessionId();

        user.sessions.push({
            sessionId,
            messageId,
            conversationId
        });

        await whats.sendMessage(phone,' *Você acaba de criar uma nova sessão. Utilize o ID abaixo para eu recuperar o contexto desta sessão posteriormente:* ')

        await whats.sendMessage(phone,` *${sessionId.toString()}* `);

        whats.sendMessage(phone,response);

    }

    createSessionId(){

        const sessionId = Math.floor( Math.random () * 1323234);

        return sessionId;

    }

    async getSession( user: IUser ){

        const { message, phone } = user;

        const currentUserSession = user.sessions[0];

        if ( currentUserSession ){

            const { response, messageId, conversationId } = await gpt.sendMessage(message,{
                conversationId: currentUserSession.conversationId,
                parentMessageId: currentUserSession.messageId
            });

            currentUserSession.messageId = messageId;
            currentUserSession.conversationId = conversationId

            await whats.sendMessage(phone,response);

        }

    }


}

export default new Session();
