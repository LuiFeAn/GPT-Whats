import { gpt } from "../providers/index.js";
import User from "./User.js";

import { ICreateSession } from "../interfaces/ICreateSession.js";

class Session {

    async createSession( user: User ): Promise< ICreateSession >{

        const { message } = user;

        const { text, parentMessageId, conversationId } = await gpt.sendMessage(message);

        const sessionId = this.createSessionId();

        user.sessions.push({
            sessionId,
            messageId: parentMessageId!,
            conversationId: conversationId!
        });

        return {
            text,
            sessionId
        }


    }

    private createSessionId(){

        const sessionId = Math.floor( Math.random () * 1323234);

        return sessionId;

    }

    async getSession( user: User ): Promise <string | undefined> {

        const { message } = user;

        const currentUserSession = user.sessions[0];

        if ( currentUserSession ){

            const { text, parentMessageId, conversationId } = await gpt.sendMessage(message,{
                conversationId: currentUserSession.conversationId,
                parentMessageId: currentUserSession.messageId
            });

            currentUserSession.messageId = parentMessageId!;
            currentUserSession.conversationId = conversationId!

            return text;

        }

    }


}

export default new Session();
