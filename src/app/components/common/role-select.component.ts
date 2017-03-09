import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppConstants} from "../../app.constants";
import {AuthService} from "../../services/AuthService";
import {BaseSelectComponent} from "../pages/section/base-select.component";

@Component({
  selector: 'role-select',
  templateUrl: '../../templates/common/role-select.component.html'
})
export class RoleSelectComponent extends BaseSelectComponent{

  roles: Array<Object> = [];

  /**
   * Title of input select field
   */
  @Input()
  title:string = "Select Role";

  /**
   * First value of options
   */
  @Input()
  first_value:string = "All";

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
    this.roles = AppConstants.getChildRoles(this._authService.user.role_id);
  }
}
