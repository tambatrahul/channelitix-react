import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
    selector: 'role-button',
    templateUrl: 'role_button.component.html'
})

export class RoleButtonComponent {

    // input role id
    @Input()
    role_id: number;

    public _role_id: number = 0;

    // output role
    @Output()
    onRoleChanged = new EventEmitter<number>();

    // set role id
    setRole(_role_id: number) {
        this.onRoleChanged.emit(_role_id);
        this.role_id = _role_id;
        this._role_id = _role_id;
    }
}
