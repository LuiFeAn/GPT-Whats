import Session from "../models/Session.js";
import { Repository } from "typeorm";

import { GptSessions } from "../types/GptSessions.js";
import configs from "../global/configs/index.js";

import { sessions } from "../database/index.js";

import AppDataSource from "../database/dbConfig.js";


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

        this.repository = AppDataSource.getRepository(Session)

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

            await this.repository.save(session);

            await this.disableOtherSessinons(phone);


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

    async setSessionWithCurrent(id: string, phone: string){

        const find = this.findSession(id);

        if( !find ){

            return

        }

        await this.disableOtherSessinons(phone);

        const session = await this.repository.update(id,{
            selected_session:'yes'
        });

        return session;

    }


    async disableOtherSessinons(phone: string){

        const activedSessions = await this.findSessions(phone,'yes');

        activedSessions.forEach( session => this.repository.update( session.session_id, {
            selected_session:'no'
        }));

    }

    async findSessions(phone: string, selectedSession?: string){

        if( configs.connectionWithDb ){

            const sessions = await this.repository.find({
                where:[
                    {
                        phone
                    },
                    {
                        phone,
                        selected_session: selectedSession
                    }
                ]
            })

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
