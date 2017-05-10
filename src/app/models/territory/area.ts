import {Model} from "../model";
import {CustomerType} from "../customer/customer_type";
import {Region} from "./region";

export class Area extends Model {

    name: string;
    hq_region: Region;

    // for internal user only
    customer_types: CustomerType[];
    total: number = 0;

    territories_count: number = 0;
    headquarters_count: number = 0;
    bricks_count: number = 0;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.customer_types = info.customer_types;
        this.total = info.total;
        if (info.hq_region)
            this.hq_region = new Region(info.hq_region);

        if (info.territories_count)
            this.territories_count = info.territories_count.aggregate;

        if (info.headquarters_count)
            this.headquarters_count = info.headquarters_count.aggregate;

        if (info.bricks_count)
            this.bricks_count = info.bricks_count.aggregate;
    }

    /**
     * get total number of customers
     *
     * @returns {number}
     */
    get total_customer() {
        let total = 0;
        this.customer_types.map(cus => {
            cus.grades.map(grade => {
                if (grade.customer_count)
                    total += grade.customer_count;
            })
        });
        return total;
    }
}
