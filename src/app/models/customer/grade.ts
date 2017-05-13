import {Model} from "../model";
import {CustomerType} from "./customer_type";

export class Grade extends Model {

    name: string;
    customer_type: CustomerType;

    // for internal user only
    customer_count: number = 0;
    visit_count: number = 0;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.customer_type = info.customer_type;
        if (info.customer_count)
            this.customer_count = parseInt(info.customer_count);
        if (info.visit_count)
            this.visit_count = parseInt(info.visit_count);
    }
}
