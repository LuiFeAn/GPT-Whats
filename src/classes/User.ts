import { IUser } from "../interfaces/IUser.js";
import { GptSessions } from "../types/GptSessions.js";
import { State } from "../types/alias/States.js";


class User {

    readonly phone: string;
    message: string;
    state: State;
    sessions: GptSessions [];
    processing: boolean;

    constructor( { phone, message, state, sessions, processing}: IUser ){

        this.phone = phone;
        this.message = message;
        this.state = state;
        this.sessions = sessions;
        this.processing = processing

    }

}

export default User;
