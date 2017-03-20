import {Model} from "../model";

export class Message extends Model {

    message: string;
    to_user_id: number;

    constructor(info: any) {
        super(info.id);
        this.message = info.message;
        this.to_user_id = info.to_user_id;
    }
}
