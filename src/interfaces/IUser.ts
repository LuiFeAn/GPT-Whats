import { State } from "../types/alias/States.js";
import Session from "../models/Session.js";
import { Options } from "../types/alias/Options.js";

export interface IUser {

    readonly phone: string,
    message: string | Options,
    state: State,
    sessions: Session [],

}
