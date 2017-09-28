import {Component, Input} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {UserService} from "../../../../services/user.service";

@Component({
    selector: 'user-select',
    templateUrl: 'user-select.component.html'
})
export class UserSelectComponent extends BaseSelectComponent {

    /**
     * title for select field
     */
    @Input()
    title: string = "Select User";

    /**
     * First value of options
     */
    @Input()
    first_value: string = "All";

    /**
     * role id for filter
     */
    private _role_id: number;
    private _manager_id: number;
    private _status: string;

    constructor(private userService: UserService) {
        super();
    }

    /**
     * role_id getter and setters
     *
     * @param status
     */
    @Input()
    set status(status: string) {
        this._status = status;
        this.fetch();
    }

    get status(): string {
        return this._status;
    }

    /**
     * role_id getter and setters
     *
     * @param role_id
     */
    @Input()
    set role_id(role_id: number) {
        this._role_id = role_id;
        this.fetch();
    }

    get role_id(): number {
        return this._role_id;
    }

    /**
     * manager_id getter and setters
     *
     * @param manager_id
     */
    @Input()
    set manager_id(manager_id: number) {
        this._manager_id = manager_id;
        this.fetch();
    }

    get manager_id(): number {
        return this._manager_id;
    }

    /**
     * load users
     */
    fetch() {
        this.loading = true;
        this.userService.children(this._role_id, this._manager_id, this._status).subscribe(
            response => {
                this.loading = false;
                this.models = response.users;
            },
            err => {
                this.loading = false;
            }
        );
    }
}
