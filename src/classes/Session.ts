import { gpt } from "../providers/index.js";
import User from "./User.js";

class Session {

    async createSession( user: User ): Promise<any>{

        const { message } = user;

        const { response, messageId, conversationId } = await gpt.sendMessage(message);

        const sessionId = this.createSessionId();

        user.sessions.push({
            sessionId,
            messageId,
            conversationId
        });

        return {
            response,
            sessionId
        }


    }

    createSessionId(){

        const sessionId = Math.floor( Math.random () * 1323234);

        return sessionId;

    }

    async getSession( user: User ): Promise <string | undefined> {

        const { message } = user;

        const currentUserSession = user.sessions[0];

        if ( currentUserSession ){

            const { response, messageId, conversationId } = await gpt.sendMessage(message,{
                conversationId: currentUserSession.conversationId,
                parentMessageId: currentUserSession.messageId
            });

            currentUserSession.messageId = messageId;
            currentUserSession.conversationId = conversationId

            return response;

        }

    }


}

export default new Session();
