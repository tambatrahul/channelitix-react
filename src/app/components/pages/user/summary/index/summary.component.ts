import {Component, ViewChild, ElementRef} from "@angular/core";
import * as moment from "moment";
import {BaseAuthComponent} from "../../../../base/base_auth.component";
import {User} from "../../../../../models/user/user";
import {AuthService} from "../../../../../services/AuthService";
import {UserService} from "../../../../../services/user.service";
import {AppConstants} from "../../../../../app.constants";
declare let jQuery: any;

@Component({
    templateUrl: 'summary.component.html',
    styleUrls: ['summary.component.less']
})
export class SummaryComponent extends BaseAuthComponent {

    /**
     * user tour program modal loading identifier
     */
    @ViewChild('user_tour_program_modal')
    user_tour_program_modal: ElementRef;

    /**
     * Resetting User Password
     */
    user: User;

    /**
     * year and month for calendar
     * @type {number}
     */
    public month: number;
    public year: number;

    /**
     * users
     *
     * @type {{}}
     */
    public users: User[] = [];

    /**
     * User List
     *
     * @param _service
     * @param userService
     */
    constructor(public _service: AuthService, public userService: UserService) {
        super(_service);
    }

    /**
     * on start of app set this details
     */
    ngOnInit() {
        super.ngOnInit();
        this.month = moment().month();
        this.year = moment().year();
        this.fetch();
    }

    /**
     * load users for logged in user
     */
    fetch() {
        this.loading = true;
        this.userService.children(AppConstants.getRoleId(this.ROLE_CSE)).subscribe(
            response => {
                this.users = response.users.map(function (user) {
                    return new User(user);
                });
                this.user = this.users[0];
                this.loading = false;
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * On User Selected
     *
     * @param user
     */
    onUserSelected(user: User) {
        this.user = user;
    }

    /**
     * month and year changed
     *
     * @param date
     */
    monthYearChanged(date) {
        this.month = date.month;
        this.year = date.year;
    }

    /**
     * show list of tours
     * @param user
     */
    onShowTour() {
        jQuery(this.user_tour_program_modal.nativeElement).modal();
    }
}