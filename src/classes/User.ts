import Session from "../models/Session.js";

import { IUser } from "../interfaces/IUser.js";
import { State } from "../types/alias/States.js";
import { Options } from "../types/alias/Options.js";


class User {

    readonly phone: string;
    message: string | Options;
    state: State;
    sessions: Session [];

    constructor( { phone, message, state, sessions }: IUser ){

        this.phone = phone;
        this.message = message;
        this.state = state;
        this.sessions = sessions

    }



}

export default User;
