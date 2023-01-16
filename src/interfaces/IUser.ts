import { State } from "../types/State.js";

type GptSessions = {

    sessionId: number,
    messageId: string,
    conversationId: string,

}

export interface IUser {

    phone: string,
    message: string,
    state: State,
    sessions: GptSessions [],

}
