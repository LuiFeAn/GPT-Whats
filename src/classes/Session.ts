import { gpt } from "../providers/index.js";
import User from "./User.js";

import { v4 } from "uuid";

import { ICreateSession } from "../interfaces/ICreateSession.js";

import sessionService from "../services/sessionService.js";


class Session {

    async createSession( user: User ): Promise< ICreateSession >{

        const { message, phone } = user;

        const { text, parentMessageId: conversationId, id: parentMessageId } = await gpt.sendMessage(message);

        const sessionId = v4();

        await sessionService.createSession({
            sessionId: sessionId!,
            phone,
            messageId: parentMessageId!,
            conversationId: conversationId!
        });

        return {
            text,
            sessionId
        }


    }


    async getSession( user: User ): Promise <string | undefined> {

        const { message } = user;

        const session = await sessionService.findCurrentSession( user.phone );

        if ( session ){

            const { text, parentMessageId: conversationId, id: parentMessageId } = await gpt.sendMessage(message,{
                conversationId: session.conversation_id,
                parentMessageId: session.message_id
            });

            session.message_id = parentMessageId!;
            session.conversation_id = conversationId!

            return text;

        }

    }


}

export default new Session();
