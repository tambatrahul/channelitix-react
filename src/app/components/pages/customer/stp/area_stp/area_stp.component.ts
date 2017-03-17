import {Component} from "@angular/core";
import {ListComponent} from "../../../../base/list.component";
import {Stp} from "../../../../../models/customer/stp";
import {StpService} from "../../../../../services/stp.service";
import {AuthService} from "../../../../../services/AuthService";
import {CustomerType} from "../../../../../models/customer/customer_type";
import {ActivatedRoute} from "@angular/router";
import {Area} from "../../../../../models/territory/area";
declare let jQuery: any;

@Component({
    templateUrl: 'area_stp.component.html',
    styleUrls: ['area_stp.component.less']
})
export class AreaStpComponent extends ListComponent {

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
    public areas: Area[] = [];

    /**
     * region id for filter
     */
    private _region_id: number;
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
            this._region_id = params['region_id'];
            this._country_id = params['country_id'];
            this.loading = true;
            this.stpService.all(null, this._region_id).subscribe(
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
        let areas = {};

        // preparing brick skeleton
        for (let stp of this.stps) {
            if (!areas.hasOwnProperty(stp.hq_area_id)) {
                areas[stp.hq_area_id] = {
                    total: 0,
                    customer_types: this.customer_types.map(ct => new CustomerType(ct))
                };
                this.areas.push(stp.hq_area);
            }

            for (let ct of areas[stp.hq_area_id].customer_types) {
                for (let grade of ct.grades) {
                    if (grade.id == stp.grade_id) {
                        grade.customer_count = stp.customer_count;
                        areas[stp.hq_area_id].total += stp.customer_count
                    }
                }
            }
        }

        // format customers
        for (let area of this.areas) {
            if (!areas.hasOwnProperty(area.id)) {
                area.customer_types = Object.assign([], this.customer_types);
                area.total = 0;
            } else {
                area.customer_types = areas[area.id].customer_types;
                area.total = areas[area.id].total;
            }
        }
        console.log(this.areas);
    }
}
