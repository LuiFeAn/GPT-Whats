import { State } from "../types/alias/State.js";

import { GptSessions } from "../types/GptSessions.js";

export interface IUser {

    phone: string,
    message: string,
    state: State,
    sessions: GptSessions [],
    processing: boolean

}
