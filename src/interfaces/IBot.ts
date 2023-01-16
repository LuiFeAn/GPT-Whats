import WAWebJS from "whatsapp-web.js";

import { IUser } from "./IUser.js";


export interface IBot  {

    options: WAWebJS.Message,
    user: IUser

}
