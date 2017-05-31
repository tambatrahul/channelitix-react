import {Component, Input} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {AuthService} from "../../../../services/AuthService";
import {AppConstants} from "../../../../app.constants";

@Component({
    selector: 'role-select',
    templateUrl: 'role-select.component.html'
})
export class RoleSelectComponent extends BaseSelectComponent {

    roles: Array<Object> = [];

    /**
     * Title of input select field
     */
    @Input()
    title: string = "Select Role";

    /**
     * First value of options
     */
    @Input()
    first_value: string = "All";

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
        if (this._authService.user.role_str != 'THIRD_PARTY')
            this.roles = AppConstants.getChildRoles(this._authService.user.role_id);
        else
            this.roles = AppConstants.getThirdPartyChildRoles(5);
    }
}
