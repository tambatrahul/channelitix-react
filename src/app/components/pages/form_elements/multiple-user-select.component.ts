import {Component, Input} from "@angular/core";
import {MultipleBaseSelectComponent} from "./base-multiple-select.component";
import {UserService} from "../../../services/user.service";
import {AppConstants} from "../../../app.constants";
import {User} from "../../../models/user/user";

@Component({
    selector: 'multiple-user-select',
    templateUrl: '../../../templates/pages/form_elements/multiple-user-select.component.html'
})
export class MultipleUserSelectComponent extends MultipleBaseSelectComponent {

    /**
     * title for select field
     */
    @Input()
    title: string = "Select User";

    /**
     * Select User
     *
     * @type {Array}
     */
    @Input()
    user_ids: Array<number> = [];

    /**
     * role id for filter
     */
    private _role_id: number;

    /**
     * Multiple user select component
     * @param userService
     */
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
                this.models = response.users.map(function (user, key) {
                    return new User(user);
                });
            },
            err => {
                this.loading = false;
            }
        );
    }
}
