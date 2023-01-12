
import WAWebJS from "whatsapp-web.js"
import { State } from "./State.js"


export type Bot = {

    messageOptions: WAWebJS.Message,
    state: State,
    userMessage: string,

}