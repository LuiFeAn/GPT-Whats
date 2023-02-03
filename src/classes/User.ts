import Session from "../models/Session.js";

import { IUser } from "../interfaces/IUser.js";
import { State } from "../types/alias/States.js";
import { Options } from "../types/alias/Options.js";


class User {

    readonly phone: string;
    message: string | Options;
    state: State;
    sessions: Session [];

    constructor( { phone, message }: IUser ){

        this.phone = phone;
        this.message = message;
        this.state = 'welcome'
        this.sessions = []

    }


    updateSessions(newSessions: Session []){

        this.sessions = newSessions;

    }



}

export default User;
