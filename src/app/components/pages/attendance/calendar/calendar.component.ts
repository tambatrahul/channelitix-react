import {Component, Input, EventEmitter, Output} from "@angular/core";
import * as moment from "moment";
import {Attendance} from "../../../../models/attendance/attendance";
import {AppConstants} from "../../../../app.constants";
import {Holiday} from "../../../../models/holiday";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
declare let jQuery: any;

@Component({
    selector: 'attendance-calendar-select',
    templateUrl: 'calendar.component.html',
    styleUrls: ['calendar.component.less']
})
export class CalendarAttendanceComponent extends ListComponent {

    /**
     * get week days for header
     *
     * @type {Array<string>}
     */
    week_days = AppConstants.week_days;

    /**
     * event Date selection
     *
     * @type {EventEmitter}
     */
    @Output()
    onAttendanceSelected = new EventEmitter();

    /**
     * month and year input
     */
    @Input()
    month: number;
    @Input()
    year: number;

    /**
     * Attendances
     */
    _attendances: Attendance[] = [];
    @Input()
    set attendances(attendance: Attendance[]) {
        this._attendances = attendance;
        this.fetch();
    }

    /**
     * get holidays from input
     *
     * @type {Array}
     */
    _holidays: Holiday[] = [];
    @Input()
    set holidays(holidays: Holiday[]) {
        this._holidays = holidays;
        this.fetch();
    }

    /**
     *
     */
    formatted_array: Attendance[] = [];

    /**
     * Customer Component constructor
     *
     * @param _service
     */
    constructor(public _service: AuthService) {
        super(_service);
    }

    /**
     * on load of call fetch
     */
    ngOnInit() {
        this.fetch();
    }

    /**
     * Fetch attendances from server
     */
    protected fetch() {
        // get skeleton
        let skeleton: Attendance[] = AppConstants.prepareMonthAttendanceSkeleton(this.month, this.year,
            this._holidays, this._service.user.joining_date, this._service.user.leaving_date);

        // get date
        let date = moment().year(this.year).month(this.month);

        // get start date and end date of month
        let start_day = date.startOf('month').weekday();
        let end_day = date.endOf('month').weekday();

        // adding attendance to skeleton
        for (let att of this._attendances) {
            att.day = skeleton[moment(att.date, "YYYY-MM-DD").date() - 1].day;
            skeleton[moment(att.date, "YYYY-MM-DD").date() - 1] = att;
        }

        // add buffer at start
        for (let i = 0; i < start_day; i++) {
            skeleton.unshift(null);
        }

        // add buffer at end
        for (let i = 1; i < 7 - end_day; i++) {
            skeleton.push(null);
        }

        // assign to formatted array for display
        this.formatted_array = skeleton;
    }

    /**
     * on attendance select changed
     *
     * @param att
     */
    selectAttendance(att: Attendance) {
        this.onAttendanceSelected.emit(att);
    }
}
