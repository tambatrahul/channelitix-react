import {Component, Input} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";

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
    constructor() {
        super();
    }

    /**
     * fetch customer types from constants
     */
    fetch() {
    }
}
