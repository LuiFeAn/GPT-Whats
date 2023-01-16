import { State } from "../types/State.js";

export interface IUser {

    phone: string,
    message: string,
    state: State,
    messageId?: string,
    conversationId?: string,

}
