import {Model} from "../model";
import {WorkType} from "./work_type";
import {LeaveType} from "./leave_type";
import {User} from "../user/user";
import * as moment from "moment";
import {Visit} from "../visit/visit";
import {Order} from "../order/order";

export class Report extends Model {

    visit: Visit;
    order: Order;
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
    }
}
