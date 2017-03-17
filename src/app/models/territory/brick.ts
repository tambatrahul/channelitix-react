import {Model} from "../model";
import {CustomerType} from "../customer/customer_type";
import {Territory} from "./territory";

export class Brick extends Model {

    name: string;
    hq_territory_id: number;
    no_of_work_days: number;
    expected_business: number;
    distance_from_hq: number;
    hq_territory: Territory;

    // for internal user only
    customer_types: CustomerType[];
    total_customer: number = 0;
    total: number = 0;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.no_of_work_days = info.no_of_work_days;
        this.expected_business = info.expected_business;
        this.distance_from_hq = info.distance_from_hq;
        this.customer_types = info.customer_types;
        this.total_customer = info.total_customer;
        this.hq_territory = info.hq_territory;
        this.total = info.total;
    }
}
