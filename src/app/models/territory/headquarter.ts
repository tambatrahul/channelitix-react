import {Model} from "../model";
import {CustomerType} from "../customer/customer_type";
import {Area} from "./area";

export class Headquarter extends Model {

    name: string;
    total: number = 0;
    hq_area: Area;

    // for internal user only
    customer_types: CustomerType[];

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.total = info.total;

        this.customer_types = info.customer_types;

        if (info.hq_area)
            this.hq_area = new Area(info.hq_area);
    }
}
