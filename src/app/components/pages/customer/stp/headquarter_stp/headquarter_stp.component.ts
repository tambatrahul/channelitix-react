import {Component} from "@angular/core";
import {ListComponent} from "../../../../base/list.component";
import {Stp} from "../../../../../models/customer/stp";
import {StpService} from "../../../../../services/stp.service";
import {AuthService} from "../../../../../services/AuthService";
import {CustomerType} from "../../../../../models/customer/customer_type";
import {ActivatedRoute} from "@angular/router";
import {Headquarter} from "../../../../../models/territory/headquarter";
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
    public customer_types: CustomerType[] = [];

    /**
     * stp list
     *
     * @type {Array}
     */
    public stps: Stp[] = [];
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
            this._area_id = params['area_id'];
            this.loading = true;
            this.stpService.all(null, null, this._area_id).subscribe(
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
        let headquarters = {};

        // preparing brick skeleton
        for (let stp of this.stps) {
            if (!headquarters.hasOwnProperty(stp.hq_headquarter_id)) {
                headquarters[stp.hq_headquarter_id] = {customer_types: this.customer_types.map(ct => new CustomerType(ct))};
                this.headquarters.push(stp.hq_headquarter);
            }

            for (let ct of headquarters[stp.hq_headquarter_id].customer_types) {
                for (let grade of ct.grades) {
                    if (grade.id == stp.grade_id)
                        grade.customer_count = stp.customer_count;
                }
            }
        }

        // format customers
        for (let headquarter of this.headquarters) {
            if (!headquarter.hasOwnProperty(headquarter.id))
                headquarter.customer_types = Object.assign([], this.customer_types);
            else
                headquarter.customer_types = headquarters[headquarter.id].customer_types;
        }
    }
}
