import {Model} from "../model";
import {CustomerType} from "../customer/customer_type";
import {Area} from "./area";

export class Headquarter extends Model {

    name: string;
    total: number = 0;
    hq_area: Area;

    // for internal user only
    customer_types: CustomerType[];

    territories_count: number = 0;
    bricks_count: number = 0;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.total = info.total;

        this.customer_types = info.customer_types;

        if (info.hq_area)
            this.hq_area = new Area(info.hq_area);

        if (info.territories_count)
            this.territories_count = info.territories_count.aggregate;

        if (info.bricks_count)
            this.bricks_count = info.bricks_count.aggregate;
    }

    /**
     * get total number of customers
     *
     * @returns {number}
     */
    get total_customer() {
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
