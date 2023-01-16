
import WAWebJS from "whatsapp-web.js"
import { IUser } from "../interfaces/IUser.js"
import { State } from "./State.js"


export type Bot = {

    options: WAWebJS.Message,
    authUser: IUser,
    botName: string

}
