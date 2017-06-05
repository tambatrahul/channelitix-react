import {Component, Input, Output, EventEmitter} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {CustomerTypeService} from "../../../../services/customer_type.service";

@Component({
    selector: 'customer-type-select',
    templateUrl: 'customer_type-select.component.html'
})
export class CustomerTypeSelectComponent extends BaseSelectComponent {

    /**
     * Title of input select field
     */
    @Input()
    title: string = "Select Customer Type";

    /**
     * First value of options
     */
    @Input()
    first_value: string = "All";

    /**
     * Role Select Component with AuthService
     */
    constructor(private customerTypeService: CustomerTypeService) {
        super();
    }

    /**
     * fetch customer types from constants
     */
    fetch() {
        this.loading = true;
        this.customerTypeService.all()
            .subscribe(
                response => {
                    this.loading = false;
                    this.models = response.customer_types;
                },
                err => {
                    this.loading = false;
                }
            );
    }
}
