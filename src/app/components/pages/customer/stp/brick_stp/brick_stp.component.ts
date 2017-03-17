import {Component} from "@angular/core";
import {ListComponent} from "../../../../base/list.component";
import {Stp} from "../../../../../models/customer/stp";
import {StpService} from "../../../../../services/stp.service";
import {AuthService} from "../../../../../services/AuthService";
import {CustomerType} from "../../../../../models/customer/customer_type";
import {ActivatedRoute} from "@angular/router";
import {Brick} from "../../../../../models/territory/Brick";
declare let jQuery: any;

@Component({
    templateUrl: 'brick_stp.component.html',
    styleUrls: ['brick_stp.component.less']
})
export class BrickStpComponent extends ListComponent {

    /**
     * customer types
     *
     * @type {Array}
     */
    public customer_types: CustomerType[] = [];

    /**
     * editing false
     */
    editing: boolean = false;

    /**
     * stp list
     *
     * @type {Array}
     */
    public stps: Stp[] = [];
    public bricks: Brick[] = [];

    /**
     * region id for filter
     */
    private _territory_id: number;
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
            this._territory_id = params['territory_id'];
            this._headquarter_id = params['headquarter_id'];
            this._area_id = params['area_id'];
            this._region_id = params['region_id'];
            this._country_id = params['country_id'];
            this.loading = true;
            this.stpService.all(null, null, null, null, this._territory_id).subscribe(
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
        let bricks = {};
        this.bricks = [];

        // preparing brick skeleton
        for (let stp of this.stps) {
            if (!bricks.hasOwnProperty(stp.hq_brick_id)) {
                bricks[stp.hq_brick_id] = {customer_types: this.customer_types.map(ct => new CustomerType(ct))};
                this.bricks.push(stp.hq_brick);
            }

            for (let ct of bricks[stp.hq_brick_id].customer_types) {
                for (let grade of ct.grades) {
                    if (grade.id == stp.grade_id) {
                        grade.customer_count = stp.customer_count;
                    }
                }
            }
        }

        // format customers
        for (let brick of this.bricks) {
            if (!bricks.hasOwnProperty(brick.id))
                brick.customer_types = Object.assign([], this.customer_types);
            else
                brick.customer_types = bricks[brick.id].customer_types;
        }
    }

    /**
     * save stp
     */
    save() {

        // prepare stps to save
        let stps: Stp[] = [];
        for (let brick of this.bricks) {
            for (let ct of brick.customer_types) {
                for (let grade of ct.grades) {
                    stps.push(new Stp({
                        grade_id: grade.id,
                        customer_count: grade.customer_count ? grade.customer_count: 0,
                        hq_brick_id: brick.id
                    }));
                }
            }
        }

        // create to server
        this.loading = true;
        this.stpService.create(stps).subscribe(
            response => {
                this.loading = false;
                this.editing = false;
                this.fetch();
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * toggle editing
     */
    toggleEditing() {
        this.editing = !this.editing;
    }
}
