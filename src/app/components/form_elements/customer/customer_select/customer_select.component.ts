import {Component, Input, Output, EventEmitter} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {CustomerTypeService} from "../../../../services/customer_type.service";
import {CustomerService} from "../../../../services/customer.service";

@Component({
    selector: 'customer_select',
    templateUrl: 'customer_select.component.html'
})
export class CustomerSelectComponent extends BaseSelectComponent {

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
        this.customerService.all()
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
