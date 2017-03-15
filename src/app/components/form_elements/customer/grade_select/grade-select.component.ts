import {Component, Input} from "@angular/core";
import {CustomerService} from "../../../../services/customer.service";
import {BaseSelectComponent} from "../../base-select.component";

@Component({
    selector: 'grade-select',
    templateUrl: 'grade-select.component.html'
})
export class GradeSelectComponent extends BaseSelectComponent {

    /**
     * Title of input select field
     */
    @Input()
    title: string = "Select Customer Grade";

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
     * fetch customer grades from constants
     */
    fetch() {
    }
}
