import {Component} from "@angular/core";
import {ListComponent} from "../../../../base/list.component";
import {Stp} from "../../../../../models/customer/stp";
import {StpService} from "../../../../../services/stp.service";
import {AuthService} from "../../../../../services/AuthService";
import {CustomerType} from "../../../../../models/customer/customer_type";
import {ActivatedRoute} from "@angular/router";
import {Headquarter} from "../../../../../models/territory/headquarter";
import {Customer} from "../../../../../models/customer/customer";
import {CustomerService} from "../../../../../services/customer.service";
declare let jQuery: any;

@Component({
    templateUrl: 'headquarter_stp.component.html',
    styleUrls: ['headquarter_stp.component.less']
})
export class HeadquarterStpComponent extends ListComponent {

    /**
     * customer types
     *
     * @type {Array}
     */
    public customers: Customer[] = [];
    public customer_types: CustomerType[] = [];
    public headquarters: Headquarter[] = [];

    /**
     * region id for filter
     */
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
            this._region_id = params['region_id'];
            this._country_id = params['country_id'];
            this._area_id = params['area_id'];
            this.loading = true;
            this.customerService.stp(this._area_id, this._region_id , this._country_id).subscribe(
                response => {
                    this.loading = false;
                    this.customers = response.customers.map(function (cus, index) {
                        return new Customer(cus);
                    });
                    this.customer_types = response.customer_types.map(function (ct, index) {
                        return new CustomerType(ct);
                    });
                    this.headquarters = response.regions.map(function (headquarter, index) {
                        return new Headquarter(headquarter);
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
        let headquarters = {};

        // preparing hq_headquarter skeleton
        for (let cus of this.customers) {
            if (!headquarters.hasOwnProperty(cus.hq_headquarter_id)) {
                headquarters[cus.hq_headquarter_id] = {customer_types: this.customer_types.map(ct => new CustomerType(ct))};
            }

            for(let ct of headquarters[cus.hq_headquarter_id].customer_types) {
                for(let grade of ct.grades) {
                    if (grade.id == cus.grade_id)
                        grade.customer_count = cus.total_customers;
                }
            }
        }

        // format customers
        for(let headquarter of this.headquarters) {
            if (!headquarters.hasOwnProperty(headquarter.id))
                headquarter.customer_types = Object.assign([], this.customer_types);
            else
                headquarter.customer_types = headquarters[headquarter.id].customer_types;
        }
    }
}
