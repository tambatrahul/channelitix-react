import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppConstants} from "../../app.constants";

@Component({
  selector: 'role-select',
  templateUrl: '../../templates/common/role-select.component.html'
})
export class RoleSelectComponent {

  @Input()
  role_id: number;

  @Output()
  onRoleChanged = new EventEmitter();

  roles: Array<Object> = [];

  constructor() {
    this.roles = AppConstants.roles;
  }

  /**
   * on load of component load areas
   */
  ngOnInit() {

  }

  /**
   * emit on change of value
   */
  onRoleChange(r_id) {
    this.role_id = r_id;
    this.onRoleChanged.emit(r_id);
  }
}
