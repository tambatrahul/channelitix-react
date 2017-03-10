import {Model} from "../model";
import {User} from "../user/user";

export class Visit extends Model {

    visit_date: string;
    comments: string;
    latitude: string;
    longitude: string;
    customer_id: number;
    created_by: number;
    creator: User;

    // for internal use only
    isSunday: boolean = false;
    visit_count: number = 0;
    visit_day: number;

    constructor(info: any) {
        super(info.id);
        this.visit_date = info.visit_date;
        this.comments = info.comments;
        this.latitude = info.latitude;
        this.longitude = info.longitude;
        this.customer_id = info.customer_id;
        this.created_by = info.created_by;
        this.creator = info.creator;
        this.isSunday = info.isSunday;


        // internal
        if (typeof info.visit_count == 'string')
            this.visit_count = parseInt(info.visit_count);
        else if (info.visit_count)
            this.visit_count = info.visit_count;
        else
            this.visit_count = 0;

        this.visit_day = info.visit_day;
    }
}
