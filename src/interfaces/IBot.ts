import WAWebJS from "whatsapp-web.js";
import User from "../classes/User.js";



export interface IBot  {

    options: WAWebJS.Message,
    user: User

}
