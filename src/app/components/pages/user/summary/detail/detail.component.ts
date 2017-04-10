import {Component, Input, Output, EventEmitter} from "@angular/core";
import {BaseAuthComponent} from "../../../../base/base_auth.component";
import {User} from "../../../../../models/user/user";
import {AuthService} from "../../../../../services/AuthService";
import {Attendance} from "../../../../../models/attendance/attendance";
import {ReportService} from "../../../../../services/report.service";
import {Holiday} from "../../../../../models/holiday";
import {AppConstants} from "../../../../../app.constants";
import * as moment from "moment";
import {Tour} from "../../../../../models/tour_program/tour";
declare let jQuery: any;

@Component({
    selector: 'summary-detail',
    templateUrl: 'detail.component.html',
    styleUrls: ['detail.component.less']
})
export class SummaryDetailComponent extends BaseAuthComponent {
    /**
     * output for tour program
     * @type {EventEmitter}
     */
    @Output()
    showTour = new EventEmitter();

    /**
     * User
     */
    private _user: User;

    /**
     * Attendance
     *
     * @type {Array}
     */
    attendances: Attendance[] = [];

    /**
     * get date range
     *
     * @returns {Array<number>}
     */
    get dates(): Array<number> {
        let dates = [];
        for (let d = 1; d <= moment().month(this._month).year(this._year).endOf('month').date(); d++) {
            dates.push(d);
        }
        return dates;
    }

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
    _month: number;
    _year: number;

    @Input()
    set month(month: number) {
        this._month = month;
        this.fetch();
    }

    @Input()
    set year(year: number) {
        this._year = year;
        this.fetch();
    }

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
        if (this._user && this._user.id && this._month && this._year) {
            this.loading = true;
            this.reportService.summaryForUser(this._month + 1, this._year, this._user.id).subscribe(
                response => {
                    this.loading = false;

                    // get attendances
                    let attendances = response.attendances.map(function (attendance) {
                        return new Attendance(attendance);
                    });

                    // prepare skeleton for attendance
                    this.addAttendanceToSkeleton(this._user, attendances, response.holidays);

                    // get tours
                    let tours = response.tours.map(function (tour) {
                        return new Tour(tour);
                    });

                    // prepare skeleton for tours
                    this.addTourToSkeleton(this._user, tours, response.holidays);
                },
                err => {
                    this.loading = false;
                }
            );
        }
    }

    /**
     * Adding attendance to skeleton
     *
     * @param user
     * @param attendances
     * @param holidays
     */
    addAttendanceToSkeleton(user: User, attendances: Attendance[], holidays: Holiday[]) {
        let data_skeleton = AppConstants.prepareMonthAttendanceSkeleton(
            this._month, this._year, holidays, user.joining_date, user.leaving_date);

        // prepare attendance skeleton
        for (let att of attendances) {
            // set attendance details
            data_skeleton[moment(att.date, "YYYY-MM-DD").date() - 1].id = att.id;
            data_skeleton[moment(att.date, "YYYY-MM-DD").date() - 1].status = att.status;
            data_skeleton[moment(att.date, "YYYY-MM-DD").date() - 1].work_type = att.work_type;
            data_skeleton[moment(att.date, "YYYY-MM-DD").date() - 1].no_of_calls = att.no_of_calls;
            data_skeleton[moment(att.date, "YYYY-MM-DD").date() - 1].pob_amount = att.pob_amount;
        }

        this._user.attendances = data_skeleton;
    }

    /**
     * Adding tours to skeleton
     *
     * @param user
     * @param tours
     * @param holidays
     */
    addTourToSkeleton(user: User, tours: Tour[], holidays: Holiday[]) {
        // data skeleton
        let data_skeleton = AppConstants.prepareMonthTourSkeleton(this._month, this._year, holidays);

        // prepare tour skeleton
        for (let tour of tours) {
            // set tour details
            data_skeleton[tour.tour_day].tour_count = tour.tour_count;
        }

        this._user.tours = data_skeleton;
    }

    /**
     * show all tour for user
     * @param user
     */
    showAllTourForUser() {
        this.showTour.emit();
    }
}