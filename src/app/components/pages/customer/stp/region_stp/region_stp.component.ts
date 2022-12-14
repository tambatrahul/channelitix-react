import {Component, Input} from "@angular/core";
import {ListComponent} from "../../../../base/list.component";
import {AuthService} from "../../../../../services/AuthService";
import {CustomerType} from "../../../../../models/customer/customer_type";
import {ActivatedRoute} from "@angular/router";
import {Customer} from "../../../../../models/customer/customer";
import {CustomerService} from "../../../../../services/customer.service";
import {Region} from "../../../../../models/territory/region";
declare let jQuery: any;

@Component({
    templateUrl: 'region_stp.component.html',
    styleUrls: ['region_stp.component.less']
})
export class RegionStpComponent extends ListComponent {

    /**
     * customer types
     *
     * @type {Array}
     */
    public customers: Customer[] = [];
    public customer_types: CustomerType[] = [];
    public regions: Region[] = [];

    /**
     * Country id, Zone id for filter
     */
    private _country_id: number = 0;
    private _zone_id: number = 0;

    /**
     * zone_id getter and setters
     *
     * @param zone_id
     */
    @Input()
    set zone_id(zone_id: number) {
        this._zone_id = zone_id;
        this.fetch();
    }

    get zone_id(): number {
        return this._zone_id;
    }


    /**
     * Customer Component constructor
     *
     * @param customerService
     * @param _service
     */
    constructor(private customerService: CustomerService, public _service: AuthService, public route: ActivatedRoute) {
        super(_service);
    }

    /**
     * load customer stp
     */
    fetch() {
        this.route.params.subscribe(params => {
            this._zone_id = params['zone_id'];
            this._country_id = params['country_id'];
            this.loading = true;
            this.customerService.stp(this._country_id, this._zone_id).subscribe(
                response => {
                    this.loading = false;
                    this.customers = response.customers.map(function (cus, index) {
                        return new Customer(cus);
                    });
                    this.customer_types = response.customer_types.map(function (ct, index) {
                        return new CustomerType(ct);
                    });
                    this.regions = response.regions.map(function (area, index) {
                        return new Region(area);
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
        let regions = {};

        // preparing hq_region skeleton
        for (let cus of this.customers) {
            if (!regions.hasOwnProperty(cus.hq_region_id)) {
                regions[cus.hq_region_id] = {customer_types: this.customer_types.map(ct => new CustomerType(ct))};
            }

            for(let ct of regions[cus.hq_region_id].customer_types) {
                for(let grade of ct.grades) {
                    if (grade.id == cus.grade_id)
                        grade.customer_count = cus.total_customers;
                }
            }
        }

        // format customers
        for(let region of this.regions) {
            if (!regions.hasOwnProperty(region.id))
                region.customer_types = Object.assign([], this.customer_types);
            else
                region.customer_types = regions[region.id].customer_types;
        }
    }
}
