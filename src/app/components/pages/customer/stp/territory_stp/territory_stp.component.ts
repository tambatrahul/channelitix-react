import {Component} from "@angular/core";
import {ListComponent} from "../../../../base/list.component";
import {Stp} from "../../../../../models/customer/stp";
import {StpService} from "../../../../../services/stp.service";
import {AuthService} from "../../../../../services/AuthService";
import {CustomerType} from "../../../../../models/customer/customer_type";
import {ActivatedRoute} from "@angular/router";
import {Territory} from "../../../../../models/territory/territory";
import {Customer} from "../../../../../models/customer/customer";
import {CustomerService} from "../../../../../services/customer.service";
import {Brick} from "../../../../../models/territory/brick";
import {el} from "@angular/platform-browser/testing/browser_util";
declare let jQuery: any;

@Component({
    templateUrl: 'territory_stp.component.html',
    styleUrls: ['territory_stp.component.less']
})
export class TerritoryStpComponent extends ListComponent {

    /**
     * customer types
     *
     * @type {Array}
     */
    public customers: Customer[] = [];
    public customer_types: CustomerType[] = [];
    public territories: Territory[] = [];
    public new_territories = {};
    public bricks: Brick[] = [];
    public total = {};
    public all_total = 0;

    /**
     * region id for filter
     */
    private _headquarter_id: number;
    private _area_id: number;
    private _region_id: number;
    private _country_id: number;

    /**
     * Customer Component constructor
     *
     * @param customerService
     * @param _service
     * @param route
     */
    constructor(private customerService: CustomerService, public _service: AuthService, public route: ActivatedRoute) {
        super(_service);
    }

    /**
     * on load of component
     */
    ngOnInit() {
        super.ngOnInit();
    }

    /**
     * load customer stp
     */
    fetch() {
        this.route.params.subscribe(params => {
            this._headquarter_id = params['headquarter_id'];
            this._area_id = params['area_id'];
            this._region_id = params['region_id'];
            this._country_id = params['country_id'];
            this.loading = true;
            this.customerService.stp(this._country_id, this._region_id, this._area_id, this._headquarter_id).subscribe(
                response => {
                    this.loading = false;
                    this.customers = response.customers.map(function (cus, index) {
                        return new Customer(cus);
                    });
                    this.customer_types = response.customer_types.map(function (ct, index) {
                        return new CustomerType(ct);
                    });

                    this.territories = response.territories.map(function (territory, index) {
                        return new Territory(territory);
                    });

                    this.bricks = response.bricks.map(function (brick, index) {
                        return new Brick(brick);
                    });

                    this.formatCustomerData();
                },
                err => {
                    this.loading = false;
                }
            );
        });
    }

    /**
     * formatting customer data in stp format
     */
    formatCustomerData() {
        let territories = {};
        let total = {customer_types: this.customer_types.map(ct => new CustomerType(ct))};
        let all_total = 0;

        for (let cus of this.customers) {
            // Set Territory
            if (!territories.hasOwnProperty(cus.hq_territory_id)) {
                territories[cus.hq_territory_id] = {
                    id: cus.hq_territory.id,
                    name: cus.hq_territory.name,
                    bricks: {},
                    customer_types: this.customer_types.map(ct => new CustomerType(ct)),
                    total: 0
                };
            }

            // Set bricks in territories
            if (!territories[cus.hq_territory_id].bricks.hasOwnProperty(cus.hq_brick_id)) {
                territories[cus.hq_territory_id].bricks[cus.hq_brick_id] = {
                    id: cus.hq_brick.id,
                    name: cus.hq_brick.name,
                    distance_from_hq: cus.hq_brick.distance_from_hq != 0 ? cus.hq_brick.distance_from_hq : '',
                    no_of_work_days: cus.hq_brick.no_of_work_days != 0 ? cus.hq_brick.no_of_work_days : '',
                    customer_types: this.customer_types.map(ct => new CustomerType(ct)),
                    total: 0
                };
            }

            // Set Customer Count in territory
            for (let ct of territories[cus.hq_territory_id].customer_types) {
                for (let grade of ct.grades) {
                    if (grade.id == cus.grade_id) {
                        grade.customer_count += cus.total_customers;
                    }
                }
            }

            // Set cusotmer count in brics
            for (let ct of territories[cus.hq_territory_id].bricks[cus.hq_brick_id].customer_types) {
                for (let grade of ct.grades) {
                    if (grade.id == cus.grade_id) {
                        grade.customer_count = cus.total_customers;
                        territories[cus.hq_territory_id].total += grade.customer_count;
                        territories[cus.hq_territory_id].bricks[cus.hq_brick_id].total += grade.customer_count;
                    }
                }
            }

            for(let ct of total.customer_types){
                for (let grade of ct.grades) {
                    if (grade.id == cus.grade_id) {
                        grade.customer_count += cus.total_customers;
                        this.all_total += cus.total_customers;
                    }
                }
            }
        }

        // Set territories which are not in customers
        for (let territory of this.territories) {
            if (territory.hq_headquarter_id == this._headquarter_id) {
                if (!territories.hasOwnProperty(territory.id)) {
                    territories[territory.id] = {
                        id: territory.id,
                        name: territory.name,
                        bricks: {},
                        customer_types: this.customer_types.map(ct => new CustomerType(ct))
                    };
                }

                // Set Bricks which are not in territories
                for (let br of this.bricks) {
                    if (territory.id == br.hq_territory_id) {
                        if (!territories[territory.id].bricks.hasOwnProperty(br.id)) {
                            territories[territory.id].bricks[br.id] = {
                                id: br.id,
                                name: br.name,
                                distance_from_hq: br.distance_from_hq != 0 ? br.distance_from_hq : '',
                                no_of_work_days: br.no_of_work_days != 0 ? br.no_of_work_days : '',
                                customer_types: this.customer_types.map(ct => new CustomerType(ct))
                            };
                        }
                    }
                }
            }
        }

        this.total = total;
        this.new_territories = territories;
    }

    // Generate Object To Array
    generateArray(obj) {
        return Object.keys(obj).map((key) => {
            return obj[key]
        });
    }
}
