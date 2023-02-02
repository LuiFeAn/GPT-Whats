import Session from "../models/Session.js";
import AppDataSource from "../database/dbConfig.js";
import { Repository } from "typeorm";

import { GptSessions } from "../types/GptSessions.js";
import configs from "../configs/index.js";

import { sessions } from "../database/index.js";


interface ICreateSession extends GptSessions {

    phone: string

}


class SessionService {

    public repository: Repository<Session>

    constructor(){

        this.repository = AppDataSource.getRepository(Session)

    }

    async createSession({ sessionId, messageId, phone, conversationId }: ICreateSession){


        if( configs.connectionWithDb ){

            const session = this.repository.create({
                session_id: sessionId,
                phone,
                selected_session:'yes',
                conversation_id: conversationId,
                message_id: messageId
            });

            await this.repository.save(session)

        }else{

            sessions.push({
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

            const currentSession = this.repository.findOneBy({
                phone,
                selected_session:'yes'
            });

            return currentSession;

        }

        const currentSession = sessions.find( session => session.selected_session === 'yes' && session.phone === phone );

        return currentSession;

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
