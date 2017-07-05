import {Model} from "../model";
import {Area} from "./area";
import {CustomerType} from "../customer/customer_type";
import {Customer} from "../customer/customer";

export class Headquarter extends Model {

    name: string;
    total: number = 0;
    hq_area: Area;

    // for internal user only
    customer_types: CustomerType[];
    total_bricks: number = 0;
    target: number = 0;
    yearly_target: number = 0;
    primary: number = 0;
    yearly_primary: number = 0;
    total_pob: number = 0;
    fw_days: number = 0;
    total_visit: number = 0;
    total_visit_ab: number = 0;
    all_total_visit: number = 0;
    total_att: number = 0;
    total_order: number = 0;
    total_customers: number = 0;
    customer_count: number = 0;
    total_customers_ab: number = 0;

    territories_count: number = 0;
    bricks_count: number = 0;
    customers : Customer[] = [];

    hq_last_year_total: number = 0;
    hq_last_year_dexona_total: number = 0;
    hq_last_month_total: number = 0;
    hq_last_month_dexona_total: number = 0;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.total = info.total;

        this.customer_types = info.customer_types;

        if(info.customers)
            this.customers = info.customers.map(customer => new Customer(customer));

        if (info.hq_area)
            this.hq_area = new Area(info.hq_area);

        if (info.territories_count)
            this.territories_count = info.territories_count.aggregate;

        if (info.bricks_count)
            this.bricks_count = info.bricks_count.aggregate;

        if (info.total_bricks)
            this.total_bricks = parseInt(info.total_bricks);

        if (info.total_order)
            this.total_order = parseInt(info.total_order);

        if (info.hq_last_year_total)
            this.hq_last_year_total = parseInt(info.hq_last_year_total);

        if (info.hq_last_year_dexona_total)
            this.hq_last_year_dexona_total = parseInt(info.hq_last_year_dexona_total);

        if (info.hq_last_month_total)
            this.hq_last_month_total = parseInt(info.hq_last_month_total);

        if (info.hq_last_month_dexona_total)
            this.hq_last_month_dexona_total = parseInt(info.hq_last_month_dexona_total);
    }

    /**
     * get total number of customers
     *
     * @returns {number}
     */
    get total_customer(): number {
        let total: number = 0;
        this.customer_types.map(cus => {
            cus.grades.map(grade => {
                if (grade.customer_count)
                    total += grade.customer_count;
            })
        });
        return total;
    }

    get retailer_count(): number {
        let total: number = 0;
        this.customer_types.map(cus => {
            if (cus.name == "Retailer") {
                total = cus.brick_count
            }
        });
        return total;
    }

    get semi_count(): number {
        let total: number = 0;
        this.customer_types.map(cus => {
            if (cus.name == "Semi") {
                total = cus.brick_count
            }
        });
        return total;
    }

    get hub_count(): number {
        let total: number = 0;
        this.customer_types.map(cus => {
            if (cus.name == "Hub Chemist") {
                total = cus.brick_count
            }
        });
        return total;
    }

    get phy_count(): number {
        let total: number = 0;
        this.customer_types.map(cus => {
            if (cus.name == "Physician") {
                total = cus.brick_count
            }
        });
        return total;
    }

    /**
     * check if headquarter is on budget.
     * @returns {boolean}
     */
    get onBudget() {
        if (this.target > 0)
            return this.primary >= this.target;
        else
            return false;
    }

    /**
     * check if headquarter is on 90% budget.
     * @returns {boolean}
     */
    get onBudget90() {
        return this.primary >= (this.target * 0.9) && this.primary < this.target;
    }

    /**
     * check if headquarter is on less than 90% budget.
     * @returns {boolean}
     */
    get onBudgetLess90() {
        return this.primary < (this.target * 0.9);
    }

    /**
     * check if headquarter is on target.
     * @returns {boolean}
     */
    get onTarget() {
        if (this.total_pob > 0) {
            return this.total_pob >= (this.target * 0.3);
        }
    }

    /**
     * percentage coverage
     *
     * @returns {number}
     */
    get call_average() {
        return this.total_att > 0 ? (this.total_visit / this.total_att) : 0;
    }

    /**
     * get total attendances as per norm
     * @returns {boolean}
     */
    get attAsPerNorm23() {
        return this.total_att >= 23;
    }

    /**
     * get total attendances as per norm
     * @returns {boolean}
     */
    get coverageAsPerNorm85() {
        if (this.total_customers > 0) {
            return ((this.total_visit / this.total_customers) * 100) > 85;
        }

        return false;
    }

    /**
     * get total customers
     * @returns {number}
     */
    get coverage() {
        if (this.total_visit_ab > 0)
            return ((this.total_visit_ab / this.total_customers_ab) * 100);
        else
            return 0;
    }
}
