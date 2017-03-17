import {Model} from "../model";
import {Headquarter} from "./headquarter";
import {CustomerType} from "../customer/customer_type";

export class Territory extends Model {

    name: string;
    hq_headquarter: Headquarter;
    hq_headquarter_id: number;

    // for internal user only
    customer_types: CustomerType[];
    total: number = 0;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.hq_headquarter = info.hq_headquarter;
        this.hq_headquarter_id = info.hq_headquarter_id;

        this.customer_types = info.customer_types;
        this.total = info.total;
    }
}
