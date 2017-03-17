import {Component} from "@angular/core";
import {ListComponent} from "../../../../base/list.component";
import {Stp} from "../../../../../models/customer/stp";
import {StpService} from "../../../../../services/stp.service";
import {AuthService} from "../../../../../services/AuthService";
import {CustomerType} from "../../../../../models/customer/customer_type";
import {ActivatedRoute} from "@angular/router";
import {Territory} from "../../../../../models/territory/territory";
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
    public customer_types: CustomerType[] = [];

    /**
     * stp list
     *
     * @type {Array}
     */
    public stps: Stp[] = [];
    public territories: Territory[] = [];

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
            this._headquarter_id = params['headquarter_id'];
            this._area_id = params['area_id'];
            this._region_id = params['region_id'];
            this._country_id = params['country_id'];
            this.loading = true;
            this.stpService.all(null, null, null, this._headquarter_id).subscribe(
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
        let territories = {};

        // preparing brick skeleton
        for (let stp of this.stps) {
            if (!territories.hasOwnProperty(stp.hq_territory_id)) {
                territories[stp.hq_territory_id] = {customer_types: this.customer_types.map(ct => new CustomerType(ct))};
                this.territories.push(stp.hq_territory);
            }

            for (let ct of territories[stp.hq_territory_id].customer_types) {
                for (let grade of ct.grades) {
                    if (grade.id == stp.grade_id)
                        grade.customer_count = stp.customer_count;
                }
            }
        }

        // format customers
        for (let territory of this.territories) {
            if (!territory.hasOwnProperty(territory.id))
                territory.customer_types = Object.assign([], this.customer_types);
            else
                territory.customer_types = territories[territory.id].customer_types;
        }
    }
}
