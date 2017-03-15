import {Component} from "@angular/core";
import {AttendanceService} from "../../../../services/attendance.service";
import {Attendance} from "../../../../models/attendance/attendance";
import {Holiday} from "../../../../models/holiday";
import {ListComponent} from "../../../base/list.component";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";
import * as moment from "moment";
declare let jQuery: any;

@Component({
    templateUrl: 'monthly.component.html',
    styleUrls: ['monthly.component.less']
})
export class MonthlyAttendanceComponent extends ListComponent {

    /**
     * month and year input
     */
    month: number;
    year: number;

    today: boolean =false;

    /**
     * Attendances
     */
    attendance: Attendance;
    attendances: Attendance[] = [];

    /**
     * get holidays from input
     *
     * @type {Array}
     */
    holidays: Holiday[] = [];

    /**
     * User Component Constructor
     *
     * @param attendanceService
     * @param _router
     * @param _service
     */
    constructor(private attendanceService: AttendanceService, public _router: Router, public _service: AuthService) {
        super(_service);
    }

    /**
     * on load of call fetch
     */
    ngOnInit() {
        this.month = moment().month();
        this.year = moment().year();
        this.fetch();
    }

    /**
     * Fetch all details
     */
    protected fetch() {
        this.fetchAttendances();
    }

    /**
     * Fetch attendance from server
     */
    fetchAttendances() {
        this.loading = true;
        this.attendanceService.monthly(this.month + 1, this.year).subscribe(
            response => {
                this.loading = false;
                this.attendances = response.attendances;
                this.holidays = response.holidays;
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
     * on date selection
     *
     * @param att
     */
    onAttendanceSelected(att: Attendance) {
        if(moment(att.date,"YYYY-MM-DD") > moment().add(1, 'days'))
            this.today = true;
        else
            this.today = false;
        this.attendance = att;

    }

    /**
     * attendance created refresh attendance list
     */
    attendanceCreated() {
        this.attendance = null;
        this.fetchAttendances();
    }

    /**
     * attendance updated refresh attendance list
     */
    attendanceUpdated() {
        this.attendance = null;
        this.fetchAttendances();
    }
}
