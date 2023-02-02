import { gpt } from "../providers/index.js";
import User from "./User.js";

import { v4 } from "uuid";

import { ICreateSession } from "../interfaces/ICreateSession.js";
import configs from "../configs/index.js";
import sessionService from "../services/sessionService.js";

class Session {

    async createSession( user: User ): Promise< ICreateSession >{

        const { message } = user;

        const { text, parentMessageId: conversationId, id: parentMessageId } = await gpt.sendMessage(message);

        const sessionId = v4();

        if( configs.connectionWithDb ){

            await sessionService.createSession({
                sessionId: sessionId!,
                messageId: parentMessageId!,
                conversationId: conversationId!
            });

        }else{

            user.sessions.push({
                sessionId,
                messageId: parentMessageId!,
                conversationId: conversationId!
            });

        }

        return {
            text,
            sessionId
        }


    }

    async getSession( user: User ): Promise <string | undefined> {

        const { message } = user;

        const currentUserSession = user.sessions[0];

        if ( currentUserSession ){

            const { text, parentMessageId: conversationId, id: parentMessageId } = await gpt.sendMessage(message,{
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
