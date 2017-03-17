import {Model} from "../model";
import {CustomerType} from "../customer/customer_type";
import {Region} from "./region";

export class Area extends Model {

    name: string;
    hq_region: Region;

    // for internal user only
    customer_types: CustomerType[];
    total: number = 0;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.customer_types = info.customer_types;
        this.total = info.total;
        if (info.hq_region)
            this.hq_region = new Region(info.hq_region);
    }
}
