import {Model} from "../model";
import {User} from "../user/user";
import {OrderItem} from "./order_item";
import {Customer} from "../customer/customer";
import {Attendance} from "../attendance/attendance";
import {Product} from "./product";

export class Order extends Model {

    order_date: string;
    total_price: number;
    unit_price: number = 0;
    total_discount: number;
    total_points: number;
    comments: string;
    customer_id: number;
    customer: Customer;
    created_by: number;
    creator: User;
    order_items: OrderItem[] = [];
    delivered_by: number;
    delivered_by_synergy: number;
    delivered_by_user: Customer;
    delivered_by_synergy_user: Customer;

    // for internal use only
    isSunday: boolean = false;
    order_total_count: number = 0;
    order_total_quantity: number = 0;
    mg_order_total_count: number = 0;
    mg_order_total_quantity: number = 0;
    zsm_order_total_count: number = 0;
    zsm_order_total_quantity: number = 0;
    order_day_total_count: number = 0;
    order_day: number;
    order_month: number;
    attendance: Attendance = new Attendance({});
    total_target: number = 0;
    hq_headquarter_id: number = 0;
    hq_brick_id: number = 0;
    hq_area_id: number = 0;
    hq_region_id: number = 0;
    product_id: number = 0;
    order_count: number = 0;
    customer_type_id: number = 0;

    constructor(info: any) {
        super(info.id);
        this.order_date = info.order_date;
        this.total_price = info.total_price;
        this.total_discount = info.total_discount;
        this.total_points = info.total_points;
        this.comments = info.comments;
        this.delivered_by = info.delivered_by;
        this.delivered_by_synergy = info.delivered_by_synergy;
        this.product_id = info.product_id;

        if (info.unit_price)
            this.unit_price = parseFloat(info.unit_price);

        this.customer_id = info.customer_id;
        if (info.created_by)
            this.created_by = parseInt(info.created_by);
        if (info.creator)
            this.creator = new User(info.creator);
        this.isSunday = info.isSunday;
        this.order_day = info.order_day;

        if (info.customer)
            this.customer = new Customer(info.customer);

        if (info.order_total_count)
            this.order_total_count = parseFloat(info.order_total_count);

        if (info.order_total_quantity)
            this.order_total_quantity = parseFloat(info.order_total_quantity);

        if (info.order_day_total_count)
            this.order_day_total_count = parseFloat(info.order_day_total_count);

        if (info.order_items)
            this.order_items = info.order_items.map(function (item) {
                return new OrderItem(item);
            });

        if (info.delivered_by_user)
            this.delivered_by_user = new Customer(info.delivered_by_user);

        if (info.delivered_by_synergy_user)
            this.delivered_by_synergy_user = new Customer(info.delivered_by_synergy_user);

        if (info.total_target)
            this.total_target = parseFloat(info.total_target);

        if (info.hq_headquarter_id)
            this.hq_headquarter_id = parseInt(info.hq_headquarter_id);

        if (info.hq_area_id)
            this.hq_area_id = parseInt(info.hq_area_id);

        if (info.hq_region_id)
            this.hq_region_id = parseInt(info.hq_region_id);

        if (info.customer_type_id)
            this.customer_type_id = parseInt(info.customer_type_id);

        if (info.order_month)
            this.order_month = parseInt(info.order_month);

        if (info.order_count)
            this.order_count = parseInt(info.order_count);

        this.hq_brick_id = info.hq_brick_id;
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

    /**
     * get synergy product
     *
     * @returns {number}
     */
    get isSynergy() {
        let synergy = false;
        this.order_items.map(function (item) {
            if (item.quantity > 0 && item.product.synergy == 1)
                synergy = true;
        });
        return synergy;
    }

    /**
     * get synergy product
     *
     * @returns {number}
     */
    get isNonSynergy() {
        let no_synergy = false;
        this.order_items.map(function (item) {
            if (item.quantity > 0 && item.product.synergy == 0)
                no_synergy = true;
        });
        return no_synergy;
    }

    /**
     * calculated total for order
     *
     * @returns {number}
     */
    get calculated_total() {
        let total = 0;
        this.order_items.map(item => {
            total += (item.quantity * item.unit_price);
        });
        return total;
    }
}
