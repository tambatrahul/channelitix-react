import {Model} from "../model";
import {CustomerType} from "../customer/customer_type";

export class Region extends Model {

    name: string;

    // for internal user only
    customer_types: CustomerType[];

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.customer_types = info.customer_types;
    }
}
