import {Component} from "@angular/core";
import * as moment from "moment";
import {User} from "../../../../models/user/user";
import {AttendanceService} from "../../../../services/attendance.service";
import {Attendance} from "../../../../models/attendance/attendance";
import {AppConstants} from "../../../../app.constants";
import {Holiday} from "../../../../models/holiday";
import {BaseAuthComponent} from "../../../base/base.component";
import {AuthService} from "../../../../services/AuthService";
declare let jQuery: any;

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class AttendanceTableComponent extends BaseAuthComponent {

    /**
     * manager and user Role id
     * @type {number}
     */
    public role_id: number = 0;
    public manager_role_id: number = 0;

    /**
     * manager_id
     */
    public manager_id: number = 0;

    /**
     * year and month for calendar
     * @type {number}
     */
    public month: number;
    public year: number;

    /**
     * Compact view flag
     * @type {boolean}
     */
    public compact_view: boolean = false;

    /**
     * get date range
     *
     * @returns {Array<number>}
     */
    get dates(): Array<number> {
        let dates = [];
        for (let d = 1; d <= moment().month(this.month).year(this.year).endOf('month').date(); d++) {
            dates.push(d);
        }
        return dates;
    }

    /**
     * get title of table
     * @returns {string}
     */
    get title(): string {
        return moment().year(this.year).month(this.month).format("MMMM, YYYY");
    }

    /**
     * users
     *
     * @type {{}}
     */
    public users: User[] = [];

    /**
     * Attendance Component Constructor
     *
     */
    constructor(private attendanceService: AttendanceService, private _authService: AuthService) {
        super(_authService);
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        super.ngOnInit();
        this.month = moment().month();
        this.year = moment().year();
        this.fetchAttendances();
    }

    /**
     * Adding attendance to skeleton
     *
     * @param users
     * @param attendances
     * @param holidays
     */
    addAttendanceToSkeleton(users: User[], attendances: Attendance[], holidays: Holiday[]) {
        let data_skeleton = {};

        // get skeleton
        let skeleton = AppConstants.prepareMonthAttendanceSkeleton(this.month, this.year, holidays);
        for (let user of users) {
            data_skeleton[user.id] = skeleton.map(att => Object.assign({}, att));
        }

        // prepare attendance skeleton
        for (let att of attendances) {
            // add user if not present
            if (!data_skeleton.hasOwnProperty(att.created_by)) {
                data_skeleton[att.created_by] = skeleton.map(att => Object.assign({}, att));
                users.push(new User(att.creator));
            }

            // set attendance details
            data_skeleton[att.created_by][moment(att.date, "YYYY-MM-DD").date() - 1].status = att.status;
            data_skeleton[att.created_by][moment(att.date, "YYYY-MM-DD").date() - 1].work_type = att.work_type;
        }

        // add skeleton to user
        for (let user of users) {
            if (data_skeleton.hasOwnProperty(user.id))
                user.attendances = data_skeleton[user.id];
            else
                user.attendances = skeleton.map(att => Object.assign({}, att));
        }

        this.users = users;
    }

    /**
     * load attendance for children of logged in user
     */
    fetchAttendances() {
        this.loading = true;
        this.attendanceService.forChildren(this.month + 1, this.year, this.role_id, this.manager_id).subscribe(
            response => {
                this.loading = false;
                // convert to models
                let children = response.children.map(function (user, index) {
                    return new User(user);
                });
                this.addAttendanceToSkeleton(children, response.attendances, response.holidays);
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * month and year changed
     *
     * @param date
     */
    monthYearChanged(date) {
        this.month = date.month;
        this.year = date.year;
        this.fetchAttendances();
    }

    /**
     * when role is changed filter list of attendances
     * @param role_id
     */
    roleChanged(role_id) {
        this.role_id = role_id;
        this.manager_role_id = parseInt(role_id) + 1;
        this.fetchAttendances();
    }

    /**
     * when role is changed filter list of users
     *
     * @param manager_id
     */
    managerChanged(manager_id) {
        this.manager_id = manager_id;
        this.fetchAttendances();
    }

    /**
     * Toggle compact view
     */
    toggleCompactView() {
        this.compact_view = !this.compact_view;
    }
}
