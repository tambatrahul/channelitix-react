import {Model} from "../model";
import {CustomerType} from "../customer/customer_type";

export class Area extends Model {

    name: string;

    // for internal user only
    customer_types: CustomerType[];
    total: number = 0;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.customer_types = info.customer_types;
        this.total = info.total;
    }
}
