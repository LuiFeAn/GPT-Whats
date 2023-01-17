import { IUser } from "../interfaces/IUser.js";


class User {

    phone;
    message;
    state;
    sessions;
    processing;

    constructor( { phone, message, state, sessions, processing}: IUser ){

        this.phone = phone;
        this.message = message;
        this.state = state;
        this.sessions = sessions;
        this.processing = processing

    }

}

export default User;
