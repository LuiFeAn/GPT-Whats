import { gpt } from "../providers/index.js";
import User from "./User.js";

import { v4 } from "uuid";

import { ICreateSession } from "../interfaces/ICreateSession.js";

import sessionService from "../services/sessionService.js";


class Session {

    async createSession( user: User, sessionName: string ): Promise< ICreateSession >{

        const { message, phone } = user;

        const { text, parentMessageId: conversationId, id: parentMessageId } = await gpt.sendMessage(message);

        const sessionId = v4();

        await sessionService.createSession(sessionName,{
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

        console.log(session);

        if ( session ){

            const { text, parentMessageId: conversationId, id: parentMessageId } = await gpt.sendMessage(message,{
                conversationId: session.conversation_id,
                parentMessageId: session.message_id
            });

            await sessionService.updateSession(session.session_id,{
                conversationId: conversationId!,
                messageId: parentMessageId
            })

            return text;

        }

    }


}

export default new Session();
