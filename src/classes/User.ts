import { IUser } from "../interfaces/IUser.js";

class User {

    phone
    message
    state

    constructor( {phone, message, state }: IUser ){

        this.phone = phone,
        this.message = message,
        this.state = state

    }

}

export default User;