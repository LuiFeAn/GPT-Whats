import { IUser } from "../interfaces/IUser.js";

import { users } from "../database/index.js";
import User from "../models/User.js";


class UserRepository {

    register({phone,message,state, sessions, processing}: IUser){

        users.push({
            phone,
            message,
            state,
            processing,
            sessions
        })

    }

    find(phone: string){

        const userLiterals = users.find( user => user.phone === phone );

        if ( userLiterals ){

            const user = new User( userLiterals );

            return user;

        }

        return

    }

}

export default new UserRepository();
