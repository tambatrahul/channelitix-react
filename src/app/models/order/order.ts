import {Model} from "../model";
import {User} from "../user/user";

export class Order extends Model {

    order_date: string;
    total_price: number;
    total_discount: number;
    total_points: number;
    comments: string;
    customer_id: number;
    created_by: number;
    creator: User;

    // for internal use only
    isSunday: boolean = false;
    order_total_count: number = 0;
    order_day: number;

    constructor(info: any) {
        super(info.id);
        this.order_date = info.order_date;
        this.total_price = info.total_price;
        this.total_discount = info.total_discount;
        this.total_points = info.total_points;
        this.comments = info.comments;

        this.customer_id = info.customer_id;
        this.created_by = info.created_by;
        this.creator = info.creator;
        this.isSunday = info.isSunday;
        this.order_total_count = info.order_total_count;
    }
}
