import {Component, Input} from "@angular/core";
import {BaseSelectComponent} from "../../../../form_elements/base-select.component";
import {AuthService} from "../../../../../services/AuthService";
import {AppConstants} from "../../../../../app.constants";

@Component({
    selector: 'station-select',
    templateUrl: 'station-select.component.html'
})
export class StationSelectComponent extends BaseSelectComponent {

    stations: Array<Object> = [];

    /**
     * Title of input select field
     */
    @Input()
    title: string = "HQ/OS/EX";

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
        this.stations = AppConstants.stations;
    }
}
