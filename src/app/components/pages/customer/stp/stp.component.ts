import {Component, Input} from "@angular/core";
import {CustomerService} from "../../../../services/customer.service";
import {AuthService} from "../../../../services/AuthService";
import {Customer} from "../../../../models/customer/customer";
import {ListComponent} from "../../../base/list.component";
import {CustomerType} from "../../../../models/customer/customer_type";
import {Brick} from "../../../../models/territory/brick";
declare let jQuery: any;

@Component({
    templateUrl: 'stp.component.html',
    styleUrls: ['stp.component.less']
})
export class StpComponent extends ListComponent {

    /**
     * customer list
     *
     * @type {Array}
     */
    public customers: Customer[] = [];
    public customer_types: CustomerType[] = [];
    public bricks: Brick[] = [];

    /**
     * Headquarter id for filter
     */
    private _headquarter_id: number;

    /**
     * headquarter_id getter and setters
     *
     * @param headquarter_id
     */
    @Input()
    set headquarter_id(headquarter_id: number) {
        this._headquarter_id = headquarter_id;
        this.fetch();
    }

    get headquarter_id(): number {
        return this._headquarter_id;
    }

    /**
     * Customer Component constructor
     *
     * @param customerService
     * @param _service
     */
    constructor(private customerService: CustomerService, public _service: AuthService) {
        super(_service);
    }

    /**
     * load customer stp
     */
    fetch() {
        this.loading = true;
        this.customerService.stp(this._headquarter_id).subscribe(
            response => {
                this.loading = false;
                this.customers = response.customers.map(function (cus, index) {
                    return new Customer(cus);
                });
                this.customer_types = response.customer_types.map(function (ct, index) {
                    return new CustomerType(ct);
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
    }

    /**
     * formatting customer data in stp format
     */
    formatCustomerData() {
        let bricks = {};

        // preparing brick skeleton
        for (let cus of this.customers) {
            if (!bricks.hasOwnProperty(cus.hq_brick_id)) {
                bricks[cus.hq_brick_id] = {customer_types: this.customer_types.slice(0)};
            }

            for(let ct of bricks[cus.hq_brick_id].customer_types) {
                for(let grade of ct.grades) {
                    if (grade.id == cus.grade_id)
                        grade.customer_count = cus.total_customers;
                }
            }
        }

        // format customers
        for(let brick of this.bricks) {
            if (!bricks.hasOwnProperty(brick.id))
                brick.customer_types = Object.assign([], this.customer_types);
            else
                brick.customer_types = bricks[brick.id];
        }
    }

    /**
     * when headquarter is changed filter list of customer
     *
     * @param headquarter_id
     */
    headquarterChanged(headquarter_id) {
        this._headquarter_id = headquarter_id;
    }
}
