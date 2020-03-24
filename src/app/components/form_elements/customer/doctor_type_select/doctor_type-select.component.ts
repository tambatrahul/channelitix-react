import {Component, Input, Output, EventEmitter} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {CustomerService} from '../../../../services/customer.service';

@Component({
    selector: 'doctor-type-select',
    templateUrl: 'doctor_type-select.component.html'
})
export class DoctorTypeSelectComponent extends BaseSelectComponent {

    /**
     * Title of input select field
     */
    @Input()
    title: string = "Select Doctor Type";

    /**
     * First value of options
     */
    @Input()
    first_value: string = "All";

    /**
     * Role Select Component with AuthService
     */
    constructor(private doctorTypeService: CustomerService) {
        super();
    }

    /**
     * fetch customer types from constants
     */
    fetch() {
        this.loading = true;
        this.doctorTypeService.masters()
            .subscribe(
                response => {
                    this.loading = false;
                    this.models = response.doctor_types;
                },
                err => {
                    this.loading = false;
                }
            );
    }
}
