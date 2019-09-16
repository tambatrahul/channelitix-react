import {Component, Input} from "@angular/core";
import {ListComponent} from "../../../../base/list.component";
import {AuthService} from "../../../../../services/AuthService";
import {CustomerType} from "../../../../../models/customer/customer_type";
import {ActivatedRoute} from "@angular/router";
import {Customer} from "../../../../../models/customer/customer";
import {CustomerService} from "../../../../../services/customer.service";
import {HQZone} from '../../../../../models/territory/zone';
declare let jQuery: any;

@Component({
    templateUrl: 'zone_stp.component.html',
    styleUrls: ['zone_stp.component.less']
})
export class ZoneStpComponent extends ListComponent {

    /**
     * customer types
     *
     * @type {Array}
     */
    public customers: Customer[] = [];
    public customer_types: CustomerType[] = [];
    public zones: HQZone[] = [];

    /**
     * Country id for filter
     */
    private _country_id: number = 0;

    /**
     * country_id getter and setters
     *
     * @param country_id
     */
    @Input()
    set country_id(country_id: number) {
        this._country_id = country_id;
        this.fetch();
    }

    get country_id(): number {
        return this._country_id;
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
            this._country_id = params['country_id'];
            this.loading = true;
            this.customerService.stp(this._country_id).subscribe(
                response => {
                    this.loading = false;
                    this.customers = response.customers.map(function (cus, index) {
                        return new Customer(cus);
                    });
                    this.customer_types = response.customer_types.map(function (ct, index) {
                        return new CustomerType(ct);
                    });
                    this.zones = response.zones.map(function (region, index) {
                        return new HQZone(region);
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
        let zones = {};

        // preparing hq_zone skeleton
        for (let cus of this.customers) {
            if (!zones.hasOwnProperty(cus.hq_zone_id)) {
              zones[cus.hq_zone_id] = {customer_types: this.customer_types.map(ct => new CustomerType(ct))};
            }

            for(let ct of zones[cus.hq_zone_id].customer_types) {
                for(let grade of ct.grades) {
                    if (grade.id == cus.grade_id)
                        grade.customer_count = cus.total_customers;
                }
            }
        }

        // format customers
        for(let zone of this.zones) {
            if (!zones.hasOwnProperty(zone.id))
                zone.customer_types = Object.assign([], this.customer_types);
            else
                zone.customer_types = zones[zone.id].customer_types;
        }
    }
}
