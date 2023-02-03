import AppDataSource from "../database/dbConfig.js";
import Session from "../models/Session.js";

import { FindOptionsWhere } from "typeorm";


export const sessionRepository = AppDataSource.getRepository(Session).extend({

    findOneByOffline(options: FindOptionsWhere<Session>){

        console.log('ok')

    }


})
