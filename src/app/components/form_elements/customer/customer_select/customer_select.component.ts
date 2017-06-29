import {Component, Input} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {CustomerService} from "../../../../services/customer.service";

@Component({
    selector: 'customer_select_dashboard',
    templateUrl: 'customer_select.component.html',
    inputs: ['refresh']
})
export class CustomerSelectDashboardComponent extends BaseSelectComponent {

    /**
     * Title of input select field
     */
    @Input()
    title: string = "Select Customer";

    /**
     * First value of options
     */
    @Input()
    first_value: string = "All";

    /**
     * view quantity
     *
     * @type {number}
     * @private
     */
    _refresh: boolean;
    set refresh(refresh) {
        this._refresh = refresh;
        this.fetch();
    }

    /**
     * headquarter id for filter
     */
    _headquarter_ids: Array<number> = [];
    @Input()
    set headquarter_ids(headquarter_ids) {
        this._headquarter_ids = headquarter_ids;
        this.fetch();
    };


    /**
     * Role Select Component with AuthService
     */
    constructor(private customerService: CustomerService) {
        super();
    }

    /**
     * fetch customer types from constants
     */
    fetch() {
        this.loading = true;
        this.customerService.forDashboardCustomers(this._headquarter_ids, 1)
            .subscribe(
                response => {
                    this.loading = false;
                    this.models = response.customers;
                },
                err => {
                    this.loading = false;
                }
            );
    }
}
