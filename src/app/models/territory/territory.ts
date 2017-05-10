import {Model} from "../model";
import {Headquarter} from "./headquarter";
import {CustomerType} from "../customer/customer_type";
import {Brick} from "./brick";

export class Territory extends Model {

    name: string;
    hq_headquarter: Headquarter;
    hq_headquarter_id: number;

    // for internal user only
    hq_bricks: Brick[] = [];
    customer_types: CustomerType[];
    total: number = 0;

    bricks_count: number = 0;


    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        if (info.hq_headquarter)
            this.hq_headquarter = new Headquarter(info.hq_headquarter);
        this.hq_headquarter_id = info.hq_headquarter_id;

        this.customer_types = info.customer_types;
        this.total = info.total;

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
