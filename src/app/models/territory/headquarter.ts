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
    order_count: number = 0;
    customer_count: number = 0;
    visit_count: number = 0;
    total_customers_ab: number = 0;
    total_net_amount: number = 0;
    hq_area_id: number = 0;

    territories_count: number = 0;
    bricks_count: number = 0;
    customers: Customer[] = [];

    hq_last_year_total: number = 0;
    hq_last_year_dexona_total: number = 0;
    hq_last_month_total: number = 0;
    hq_last_month_dexona_total: number = 0;

    unit_price: number = 0;
    opening: number = 0;
    adjustment: number = 0;
    secondary_sale: number = 0;
    closing: number = 0;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.total = info.total;

        this.customer_types = info.customer_types;

        if (info.customers)
            this.customers = info.customers.map(customer => new Customer(customer));

        if (info.hq_area)
            this.hq_area = new Area(info.hq_area);

        if (info.territories_count)
            this.territories_count = info.territories_count.aggregate;

        if (info.bricks_count)
            this.bricks_count = info.bricks_count.aggregate;

        if (info.total_bricks)
            this.total_bricks = parseInt(info.total_bricks);

        if (info.order_count)
            this.order_count = parseInt(info.order_count);

        if (info.visit_count)
            this.visit_count = parseInt(info.visit_count);

        if (info.total_customers)
            this.total_customers = parseInt(info.total_customers);

        if (info.customer_count)
            this.customer_count = parseInt(info.customer_count);

        if (info.total_net_amount)
            this.total_net_amount = parseInt(info.total_net_amount);

        if (info.hq_area_id)
            this.hq_area_id = parseInt(info.hq_area_id);

        if (info.target)
            this.target = parseInt(info.target);

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

        if (info.unit_price)
            this.unit_price = parseFloat(info.unit_price);

        if (info.opening)
            this.opening = parseFloat(info.opening);

        if (info.adjustment)
            this.adjustment = parseFloat(info.adjustment);

        if (info.secondary_sale)
            this.secondary_sale = parseFloat(info.secondary_sale);

        if (info.closing)
            this.closing = parseFloat(info.closing);
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
            if (cus.name == "Healthcare Provider") {
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

    /**
     * Total Shortfall
     *
     * @returns {number}
     */
    get last_month_shortfall() {
        let value = (this.hq_last_year_total / 12 - this.hq_last_month_total) > 0 ?
            (this.hq_last_year_total / 12 - this.hq_last_month_total).toFixed(2) : 0;
        if (value > 0)
            return value;
        else
            return 0;
    }


    /**
     * Total Shortfall for dexona
     *
     * @returns {number}
     */
    get last_month_dexona_shortfall() {
        let value = (this.hq_last_year_dexona_total / 12 - this.hq_last_month_dexona_total) > 0 ?
            (this.hq_last_year_dexona_total / 12 - this.hq_last_month_dexona_total).toFixed(2) : 0;
        if (value > 0)
            return value;
        else
            return 0;
    }

    /**
     * month Expected Sales
     *
     * @returns {number}
     */
    get current_month_expected() {
        let value = (2 * (this.hq_last_year_total) - this.hq_last_month_total) > 0 ?
            (2 * (this.hq_last_year_total / 12) - this.hq_last_month_total).toFixed(2) : 0;
        if (value > 0)
            return value;
        else
            return 0;
    }


    /**
     * month Expected Sales for dexona
     *
     * @returns {number}
     */
    get current_month_expected_dexona() {
        let value = (2 * (this.hq_last_year_dexona_total) - this.hq_last_month_dexona_total) > 0 ?
            (2 * (this.hq_last_year_dexona_total / 12) - this.hq_last_month_dexona_total).toFixed(2) : 0;
        if(value > 0)
            return value;
        else
            return
    }

    get closing_qty(): number {
        return this.adjustment + this.opening - this.secondary_sale;
    }

    get closing_amount(): number {
        return this.closing_qty * this.unit_price;
    }
}
