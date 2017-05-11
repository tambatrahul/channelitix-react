import {Model} from "../model";
import {CustomerType} from "./customer_type";

export class Grade extends Model {

    name: string;
    customer_type: CustomerType;

    // for internal user only
    customer_count: number;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.customer_type = info.customer_type;
        if (info.customer_count)
            this.customer_count = parseInt(info.customer_count);
    }
}
