import {Model} from "../model";
import {CustomerType} from "../customer/customer_type";
import {Country} from "./country";
import {Area} from "./area";
import {Product} from "../order/product";

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
    total_visit_ab: number = 0;
    total_att: number = 0;
    fw_days: number = 0;
    total_order: number = 0;
    yearly_target: number = 0;
    yearly_primary: number = 0;
    products: Product[] = [];

    areas_count: number = 0;
    territories_count: number = 0;
    headquarters_count: number = 0;
    bricks_count: number = 0;
    hub_physician_count: number = 0;

    active_users_count: number = 0;
    attritions_month_count: number = 0;
    attritions_year_count: number = 0;
    total_customers: number = 0;
    total_customers_ab: number = 0;

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

        if (info.hub_physician_count)
            this.hub_physician_count = parseInt(info.hub_physician_count);

        if (info.areas)
            this.areas = info.areas.map(area => new Area(area));

        if (info.total_order)
            this.total_order = parseInt(info.total_order);

        if (info.total_visit)
            this.total_visit = parseInt(info.total_visit);

        if (info.products)
            this.products = info.products.map(prd => new Product(prd));
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
     * get total hq with norms
     */
    get total_hq_with_norms() {
        let total_count = 0;
        this.areas.map(area => {
            area.headquarters.map(hq => {
                let count = 0;
                hq.customer_types.map(ct => {
                    if (ct.visit_count > 0 && ct.id != 1)
                        count += 1;
                });
                if (count == 4) {
                    total_count += 1;
                }
            });
        });
        return total_count;
    }

    get onTargetCount() {
        return this.products.filter(prd => prd.onTarget).length;
    }


    /**
     * get count of hq on budget
     * @returns {number}
     */
    get onBudgetHq() {
        let total = 0;
        this.areas.map(area => {
            total += area.headquarters.filter(hq => hq.onBudget).length;
        });
        return total;
    }

    /**
     * get count of hq on 90 % budget
     * @returns {number}
     */
    get onBudgetHq90() {
        let total = 0;
        this.areas.map(area => {
            total += area.headquarters.filter(hq => hq.onBudget90).length;
        });
        return total;
    }

    /**
     * get count of hq on < 90 % budget
     * @returns {number}
     */
    get onBudgetHqLess90() {
        let total = 0;
        this.areas.map(area => {
            total += area.headquarters.filter(hq => hq.onBudgetLess90).length;
        });
        return total;
    }

    /**
     * total headquarters
     * @returns {number}
     */
    get totalHq() {
        let total = 0;
        this.areas.map(area => {
            total += area.headquarters.length;
        });
        return total;
    }

    /**
     * check if region is on target.
     * @returns {boolean}
     */
    get targetTo30() {
        return (this.total_pob / (this.target * 0.3)) * 100;
    }

    /**
     * check if region is on target.
     * @returns {boolean}
     */
    get onTarget() {
        return this.total_pob >= (this.target * 0.3);
    }

    /**
     * get headquarter above target
     * @returns {number}
     */
    get hqAboveTarget() {
        let total = 0;
        this.areas.map(area => {
            total += area.headquarters.filter(hq => {
                return hq.onTarget
            }).length;
        });
        return total;
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
     * hq count above call average
     * @returns {number}
     */
    get hqAboveCallAverage() {
        let total = 0;
        this.areas.map(area => {
            total += area.headquarters.filter(hq => hq.call_average > 25).length;
        });
        return total;
    }

    /**
     * hq count above call average
     * @returns {number}
     */
    get totalHqAttAsPerNorm23() {
        let total = 0;
        this.areas.map(area => {
            total += area.headquarters.filter(hq => hq.attAsPerNorm23).length;
        });
        return total;
    }

    /**
     * hq count above coverage 85
     * @returns {number}
     */
    get totalHqCoverageAsPerNorm85() {
        let total = 0;
        this.areas.map(area => {
            total += area.headquarters.filter(hq => hq.coverageAsPerNorm85).length;
        });
        return total;
    }

    /**
     * hq count
     * @returns {number}
     */
    get totalHqCoverage() {
        let total = 0;
        this.areas.map(area => {
            area.headquarters.map(hq => {
                total += hq.coverage;
            });
        });
        return total;
    }
}
