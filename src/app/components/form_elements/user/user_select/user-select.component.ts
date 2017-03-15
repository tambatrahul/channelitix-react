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

    constructor(private userService: UserService) {
        super();
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
     * load users
     */
    fetch() {
        this.loading = true;
        this.userService.children(this._role_id).subscribe(
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
