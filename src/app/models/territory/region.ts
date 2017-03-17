import {Model} from "../model";
import {CustomerType} from "../customer/customer_type";
import {Country} from "./country";

export class Region extends Model {

    name: string;
    hq_country: Country;

    // for internal user only
    customer_types: CustomerType[];
    total: number = 0;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.customer_types = info.customer_types;
        this.total = info.total;
        if (info.hq_country) {
            this.hq_country = new Country(info.hq_country);
        }
    }
}
