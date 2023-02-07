import { IUser } from "../interfaces/IUser.js";

import { users } from "../database/index.js";
import User from "../lib/User.js";


class UserRepository {

    register({ phone, message }: IUser){

        const user = new User({
            phone,
            message,
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
