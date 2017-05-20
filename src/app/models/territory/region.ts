import {Model} from "../model";
import {CustomerType} from "../customer/customer_type";
import {Country} from "./country";
import {Area} from "./area";

export class Region extends Model {

    name: string;
    hq_country: Country;

    // for internal user only
    customer_types: CustomerType[];
    areas: Area[] = [];
    area_objects = {};
    total: number = 0;
    total_bricks: number = 0;
    target: number = 0;
    primary: number = 0;
    total_pob: number = 0;
    total_visit: number = 0;
    total_att: number = 0;

    areas_count: number = 0;
    territories_count: number = 0;
    headquarters_count: number = 0;
    bricks_count: number = 0;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.customer_types = info.customer_types;
        this.total = info.total;
        if (info.hq_country) {
            this.hq_country = new Country(info.hq_country);
        }

        if (info.areas_count)
            this.areas_count = info.areas_count.aggregate;

        if (info.territories_count)
            this.territories_count = info.territories_count.aggregate;

        if (info.headquarters_count)
            this.headquarters_count = info.headquarters_count.aggregate;

        if (info.bricks_count)
            this.bricks_count = info.bricks_count.aggregate;

        if (info.areas)
            this.areas = info.areas.map(area=> new Area(area));
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
