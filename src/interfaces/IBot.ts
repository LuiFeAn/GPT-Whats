import WAWebJS from "whatsapp-web.js";
import User from "../models/User.js";



export interface IBot  {

    options: WAWebJS.Message,
    user: User

}
