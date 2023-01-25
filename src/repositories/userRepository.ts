import { IUser } from "../interfaces/IUser.js";

import { users } from "../database/index.js";
import User from "../classes/User.js";


class UserRepository {

    register({phone,message,state, sessions, processing}: IUser){

        const user = new User({
            phone,
            message,
            state,
            processing,
            sessions
        });

        users.push(user);

        return user;

    }

    find(phone: string){

        const user = users.find( user => user.phone === phone );

        return user;

    }


}

export default new UserRepository();
