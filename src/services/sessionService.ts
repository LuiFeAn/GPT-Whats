import Session from "../models/Session.js";
import { Repository } from "typeorm";

import { GptSessions } from "../types/GptSessions.js";
import configs from "../configs/index.js";

import { sessions } from "../database/index.js";
import { sessionRepository } from "../repositories/sessionRepository.js";


interface ICreateSession extends GptSessions {

    phone: string

}

interface UpdateSession {

    messageId: string;
    conversationId: string;

}


class SessionService {

    public repository: Repository<Session>

    constructor(){

        this.repository = sessionRepository

    }

    async createSession(sessionName: string,{ sessionId, messageId, phone, conversationId }: ICreateSession){


        if( configs.connectionWithDb ){

            const session = this.repository.create({
                session_name: sessionName,
                session_id: sessionId,
                phone,
                selected_session:'yes',
                conversation_id: conversationId,
                message_id: messageId
            });

            await this.repository.save(session)

        }else{

            sessions.push({
                session_name: sessionName,
                session_id: sessionId,
                phone,
                selected_session:'yes',
                message_id: messageId,
                conversation_id: conversationId
            })

        }

    }

    async findCurrentSession(phone: string){

        if( configs.connectionWithDb ){

            const currentSession = await this.repository.findOneBy({
                phone,
                selected_session:'yes'
            });

            return currentSession;

        }


        const currentSession = sessions.find( session => session.selected_session === 'yes' && session.phone === phone );

        return currentSession;

    }

    async updateSession(sessionId: string, { messageId, conversationId }: UpdateSession ){

        if( configs.connectionWithDb ){

            await this.repository.update(sessionId,{
                message_id: messageId,
                conversation_id: conversationId
            });

            return;

        }

        const currentSession = sessions.find( session => session.session_id === sessionId);

        currentSession!.message_id = messageId;
        currentSession!.conversation_id = conversationId


    }

    async findSessions(phone: string){

        if( configs.connectionWithDb ){

            const sessions = await this.repository.findBy({
                phone
            });

            return sessions;

        }

        const sess = sessions.filter( session => session.phone === phone);

        return sess;

    }

    async findSession(id: string){

       if( configs.connectionWithDb ){

            const session = await this.repository.findOneBy({
                session_id: id
            });

            return session;

       }

       const sess = sessions.find( session => session.session_id === id);

       return sess;

    }


}

export default new SessionService();
