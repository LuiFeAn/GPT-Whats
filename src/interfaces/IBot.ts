import WAWebJS from "whatsapp-web.js";
import User from "../lib/User.js";



export interface IBot  {

    options: WAWebJS.Message,
    user: User

}
