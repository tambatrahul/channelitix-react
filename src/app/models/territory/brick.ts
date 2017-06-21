import {Model} from "../model";
import {CustomerType} from "../customer/customer_type";
import {Territory} from "./territory";

export class Brick extends Model {

    name: string;
    station: string;
    hq_territory_id: number;
    no_of_work_days: number;
    expected_business: number;
    distance_from_hq: number;
    hq_territory: Territory;
    customer_ab: number = 0;
    customer_others: number = 0;
    customer_retailer: number = 0;
    customer_hub_chemist: number = 0;
    customer_physician: number = 0;
    customer_semi: number = 0;
    customer_type_id: number;
    grade_id: number;
    customer_count: number = 0;
    visit_no_of_days: number = 0;
    order_total_count: number = 0;
    target: number = 0;

    // for internal user only
    customer_types: CustomerType[];
    total_customer: number = 0;
    total: number = 0;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.station = info.station;
        this.no_of_work_days = info.no_of_work_days;
        this.expected_business = info.expected_business;
        this.distance_from_hq = info.distance_from_hq;
        this.customer_types = info.customer_types;
        this.total_customer = info.total_customer;
        this.total = info.total;
        this.hq_territory_id = info.hq_territory_id;
        this.target = info.target;

        if (info.customer_ab)
            this.customer_ab = parseInt(info.customer_ab);

        if (info.customer_others)
            this.customer_others = parseInt(info.customer_others);

        if (info.customer_hub_chemist)
            this.customer_hub_chemist = parseInt(info.customer_hub_chemist);

        if (info.customer_semi)
            this.customer_semi = parseInt(info.customer_semi);

        if (info.customer_retailer)
            this.customer_retailer = parseInt(info.customer_retailer);

        if (info.customer_physician)
            this.customer_physician = parseInt(info.customer_physician);

        if (info.customer_count)
            this.customer_count = parseInt(info.customer_count);

        if (info.visit_no_of_days)
            this.visit_no_of_days = parseInt(info.visit_no_of_days);

        if (info.order_total_count)
            this.order_total_count = parseInt(info.order_total_count);

        if (info.target)
            this.target = parseInt(info.target);

        this.customer_type_id = info.customer_type_id;
        this.grade_id = info.grade_id;


        if (info.hq_territory)
            this.hq_territory = new Territory(info.hq_territory);
    }

    /**
     * get total number of customers
     *
     * @returns {number}
     */
    get total_customer_count() {
        let total: number = 0;
        this.customer_types.map(cus => {
            cus.grades.map(grade => {
                if (grade.customer_count)
                    total += grade.customer_count;
            })
        });
        return total;
    }
}
