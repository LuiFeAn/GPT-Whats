import Session from "../models/Session.js";
import AppDataSource from "../database/dbConfig.js";
import { Repository } from "typeorm";


interface ICreateSession {

    sessionId: string;
    messageId: string;
    conversationId: string

}


class SessionService {

    public repository: Repository<Session>

    constructor(){

        this.repository = AppDataSource.getRepository(Session)

    }

    async createSession({ sessionId, messageId, conversationId }: ICreateSession){

        const session = this.repository.create({
            session_id: sessionId,
            conversation_id: conversationId,
            message_id: messageId
        });

        await this.repository.save(session)

    }

    async findSession(id: string){

        const session = await this.repository.findOneBy({
            session_id: id
        });

        return session;

    }


}

export default new SessionService();
