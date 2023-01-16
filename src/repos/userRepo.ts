import { IUser } from "../interfaces/IUser.js";

import { users } from "../database/index.js";


class UserRepository {

    register({phone,message,state, sessions}: IUser){

        users.push({
            phone,
            message,
            state,
            sessions
        })

    }

    find(phone: string){

        const user = users.find( user => user.phone === phone );

        return user;
    }

}

export default new UserRepository();
