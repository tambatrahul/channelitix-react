import {Component} from "@angular/core";
import {ListComponent} from "../../../../base/list.component";
import {Stp} from "../../../../../models/customer/stp";
import {StpService} from "../../../../../services/stp.service";
import {AuthService} from "../../../../../services/AuthService";
import {Region} from "../../../../../models/territory/region";
import {CustomerType} from "../../../../../models/customer/customer_type";
import {ActivatedRoute} from "@angular/router";
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
    public customer_types: CustomerType[] = [];

    /**
     * stp list
     *
     * @type {Array}
     */
    public stps: Stp[] = [];
    public regions: Region[] = [];

    /**
     * Headquarter id for filter
     */
    private _country_id: number;

    /**
     * Customer Component constructor
     *
     * @param stpService
     * @param _service
     * @param route
     */
    constructor(private stpService: StpService, public _service: AuthService, public route: ActivatedRoute) {
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
            this._country_id = params['country_id'];
            this.loading = true;
            this.stpService.all(this._country_id).subscribe(
                response => {
                    this.loading = false;
                    this.stps = response.stps.map(function (stp, index) {
                        return new Stp(stp);
                    });
                    this.customer_types = response.customer_types.map(function (ct, index) {
                        return new CustomerType(ct);
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

        // preparing brick skeleton
        for (let stp of this.stps) {
            if (!regions.hasOwnProperty(stp.hq_region_id)) {
                regions[stp.hq_region_id] = {
                    total: 0,
                    customer_types: this.customer_types.map(ct => new CustomerType(ct))
                };
                this.regions.push(stp.hq_region);
            }

            for (let ct of regions[stp.hq_region_id].customer_types) {
                for (let grade of ct.grades) {
                    if (grade.id == stp.grade_id) {
                        grade.customer_count = stp.customer_count;
                        regions[stp.hq_region_id].total += stp.customer_count
                    }
                }
            }
        }

        // format customers
        for (let region of this.regions) {
            if (!regions.hasOwnProperty(region.id)) {
                region.customer_types = Object.assign([], this.customer_types);
                region.total = 0;
            } else {
                region.customer_types = regions[region.id].customer_types;
                region.total = regions[region.id].total;
            }
        }
    }
}
