import Session from "../models/Session.js";
import AppDataSource from "../database/dbConfig.js";
import { Repository } from "typeorm";


class SessionService {

    public repository: Repository<Session>

    constructor(){

        this.repository = AppDataSource.getRepository(Session)

    }

    async findSession(id: string){

        const session = await this.repository.findOneBy({
            sessionId: id
        });

        return session;

    }


}

export default new SessionService();