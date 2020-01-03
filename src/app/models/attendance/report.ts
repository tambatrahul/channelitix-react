import {Model} from "../model";
import {WorkType} from "./work_type";
import {LeaveType} from "./leave_type";
import {User} from "../user/user";
import * as moment from "moment";
import {Visit} from "../visit/visit";
import {Order} from "../order/order";
import {Brand} from '../order/brand';
import {Priorities} from '../visit/priorities';

export class Report extends Model {

    visit: Visit;
    order: Order;
    brand: Brand;
    priority: Priorities;
    customer_id: number;
    mobile: number;
    classification: string;

    constructor(info: any) {
        super(info.id);
        this.customer_id = info.customer_id;
        this.mobile = info.mobile;
        this.classification = info.classification;
        if (info.visit)
            this.visit = new Visit(info.visit);

        if (info.order)
            this.order = new Order(info.order);

        if (info.brand)
            this.brand = new Brand(info.brand);

        if (info.priority)
            this.priority = new Priorities(info.priority);
    }
}
