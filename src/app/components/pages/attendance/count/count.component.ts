import {Component, Input} from "@angular/core";
import {User} from "../../../../models/user/user";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {AuthService} from "../../../../services/AuthService";
declare let jQuery: any;

@Component({
    selector: '[count-attendance]',
    templateUrl: 'count.component.html',
    styleUrls: ['count.component.less']
})
export class GroupCountTableComponent extends BaseAuthComponent {

    /**
     * Compact view flag
     * @type {boolean}
     */
    public compact_view: boolean = false;

    /**
     * get title of table
     * @returns {string}
     */
    get title(): string {
        return this.manager.full_name;
    }

    @Input()
    manager: User = new User({});

    /**
     * users
     *
     * @type {{}}
     */
    _users: User[];
    @Input()
    set users(users: User[]) {
        this._users = users;
    }

    /**
     * Attendance Component Constructor
     *
     */
    constructor(private _authService: AuthService) {
        super(_authService);
    }

    /**
     * Toggle compact view
     */
    toggleCompactView() {
        this.compact_view = !this.compact_view;
    }
}
