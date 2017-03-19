import {Component, Input} from "@angular/core";
import {BaseSelectComponent} from "../../../../form_elements/base-select.component";
import {AuthService} from "../../../../../services/AuthService";
import {AppConstants} from "../../../../../app.constants";

@Component({
    selector: 'tour-type-select',
    templateUrl: 'tour-type-select.component.html'
})
export class TourTypeSelectComponent extends BaseSelectComponent {

    tour_types: Array<Object> = [];

    /**
     * Title of input select field
     */
    @Input()
    title: string = "Tour Type";

    /**
     * First value of options
     */
    @Input()
    first_value: string = "Select";

    /**
     * Role Select Component with AuthService
     */
    constructor(private _authService: AuthService) {
        super();
    }

    /**
     * fetch roles from constants
     */
    fetch() {
        this.tour_types = AppConstants.tour_types;
    }
}
