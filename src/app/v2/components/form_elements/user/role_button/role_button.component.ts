import {Component, Input, Output, EventEmitter} from "@angular/core";
import {BaseComponent} from "../../../../../components/base/base.component";

@Component({
  selector: 'role-button',
  templateUrl: 'role_button.component.html'
})
export class RoleButtonComponent extends BaseComponent {

  /**
   * role id
   */
  @Input()
  role_id: number = 0;

  /**
   * event to be raised on selection of role
   *
   * @type {EventEmitter<number>}
   */
  @Output()
  onRoleChanged = new EventEmitter<number>();

  /**
   * on click raise event
   * @param _role_id
   */
  setRole(_role_id: number) {
    this.onRoleChanged.emit(_role_id);
  }
}
