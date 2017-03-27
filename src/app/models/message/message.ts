import {Model} from "../model";
import * as moment from "moment";

export class Message extends Model {

    message: string;
    to_user_id: number;
    read: boolean;
    created_at: string;
    created_by: number;
    unread_count: number;

    constructor(info: any) {
        super(info.id);
        this.message = info.message;
        this.to_user_id = info.to_user_id;
        this.read = info.read;
        this.created_by = info.created_by;
        if (info.created_at) {
            this.created_at = moment(info.created_at, "YYYY-MM-DD HH:mm:ss").format("DD MMM hh:mm A");
        }
    }
}
