import {Component, Input} from "@angular/core";
import {BaseAuthComponent} from "../../../../base/base_auth.component";
import {User} from "../../../../../models/user/user";
import {UserService} from "../../../../../services/user.service";
import {AuthService} from "../../../../../services/AuthService";
import {Attendance} from "../../../../../models/attendance/attendance";
import {ReportService} from "../../../../../services/report.service";
declare let jQuery: any;

@Component({
    selector: 'summary-detail',
    templateUrl: 'detail.component.html',
    styleUrls: ['detail.component.less']
})
export class SummaryDetailComponent extends BaseAuthComponent {

    /**
     * User
     */
    private _user: User;

    /**
     * Attendancea
     *
     * @type {Array}
     */
    attendances: Attendance[] = [];

    /**
     * user to fetch data
     *
     * @type {number}
     */
    @Input()
    set user(user: User) {
        this._user = user;
        this.fetch();
    }

    /**
     * get user
     *
     * @returns {User}
     */
    get user() {
        return this._user;
    }

    /**
     * month and year input
     */
    @Input()
    month: number;
    @Input()
    year: number;

    /**
     * Message List Component Constructor
     */
    constructor(private reportService: ReportService, public _service: AuthService) {
        super(_service);
    }

    /**
     * Fetch Messages from server
     */
    fetch() {
        if (this._user && this._user.id) {
            this.loading = true;
            this.reportService.summaryForUser(this.month + 1, this.year, this._user.id).subscribe(
                response => {
                    this.loading = false;
                    this.attendances = response.attendances.map(function (attendance) {
                        return new Attendance(attendance);
                    });
                },
                err => {
                    this.loading = false;
                }
            );
        }
    }
}