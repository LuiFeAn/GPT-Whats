import { IUser } from "../interfaces/IUser.js";
import { GptSessions } from "../types/GptSessions.js";
import { State } from "../types/alias/States.js";
import { Options } from "../types/alias/Options.js";


class User {

    readonly phone: string;
    message: string | Options;
    state: State;
    sessions: GptSessions [];

    constructor( { phone, message, state, sessions }: IUser ){

        this.phone = phone;
        this.message = message;
        this.state = state;
        this.sessions = sessions;

    }

}

export default User;
