import {Model} from "../model";
import {User} from "../user/user";
import {OrderItem} from "./order_item";
import {Customer} from "../customer/customer";
import {Attendance} from "../attendance/attendance";

export class Order extends Model {

    order_date: string;
    total_price: number;
    unit_price: number = 0;
    total_discount: number;
    total_points: number;
    comments: string;
    customer_id: number;
    created_by: number;
    creator: User;
    order_items: OrderItem[] = [];
    delivered_by: number;
    delivered_by_user: Customer;

    // for internal use only
    isSunday: boolean = false;
    order_total_count: number = 0;
    order_day_total_count: number = 0;
    order_day: number;
    order_month: number;
    attendance: Attendance = new Attendance({});
    total_target: number = 0;

    constructor(info: any) {
        super(info.id);
        this.order_date = info.order_date;
        this.total_price = info.total_price;
        this.total_discount = info.total_discount;
        this.total_points = info.total_points;
        this.comments = info.comments;
        this.delivered_by = info.delivered_by;

        if (info.unit_price)
            this.unit_price = parseInt(info.unit_price);

        this.customer_id = info.customer_id;
        this.created_by = info.created_by;
        this.creator = info.creator;
        this.isSunday = info.isSunday;
        this.order_day = info.order_day;
        this.order_month = info.order_month;

        if (info.order_total_count)
            this.order_total_count = parseFloat(info.order_total_count);

        if (info.order_day_total_count)
            this.order_day_total_count = parseInt(info.order_day_total_count);

        if (info.order_items)
            this.order_items = info.order_items.map(function (item) {
                return new OrderItem(item);
            });

        if (info.delivered_by_user)
            this.delivered_by_user = new Customer(info.delivered_by_user);

        if (info.total_target)
            this.total_target = parseFloat(info.total_target);
    }

    /**
     * get total amount
     *
     * @returns {number}
     */
    get total_amount() {
        let total = 0;
        this.order_items.map(function (item) {
            total += (item.quantity * item.unit_price);
        });
        return total.toFixed(2);
    }
}
