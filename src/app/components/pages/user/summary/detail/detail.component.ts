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
import {Visit} from "../../../../../models/visit/visit";
import {Order} from "../../../../../models/order/order";
import {environment} from "../../../../../../environments/environment";
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
    _user: User;

  _department_id: number = 0;


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
  set department_id(department_id: number) {
    this._department_id = department_id;
    this.fetch();
  }

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
            this.reportService.summaryForUser(this._month + 1, this._year, this._user.id, this._department_id).subscribe(
                response => {
                    this.loading = false;

                    // get attendances
                    let attendances = response.attendances.map(att => new Attendance(att));

                    // visit and order formatting
                    let visits = response.visits.map(visit => new Visit(visit));
                    let orders = response.orders.map(order => new Order(order));
                    let orders_csm = response.orders_csm.map(order_csm => new Order(order_csm));

                    // prepare skeleton for attendance
                    this.addAttendanceToSkeleton(this._user, attendances, response.holidays, visits, orders, orders_csm);

                    // get tours
                    let tours = response.tours.map(function (tour) {
                        return new Tour(tour);
                    });

                    if (environment.envName != 'sk_group')
                        this._user.total_target = response.targets[0].total_target;

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
     * @param visits
     * @param orders
     * @param orders_csm
     */
    addAttendanceToSkeleton(user: User, attendances: Attendance[], holidays: Holiday[], visits: Visit[], orders: Order[], orders_csm: Order[]) {
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

        // add visit to attendance
        visits.map(visit => {
            if (visit.visit_count > 0)
                data_skeleton[visit.visit_day - 1].no_of_calls = visit.visit_count;
        });

        // add order to attendance
        orders.map(order => {
            if (order.order_day_total_count > 0)
                data_skeleton[order.order_day - 1].pob_amount = order.order_day_total_count;
        });

       // add order of csm to attendance
      orders_csm.map(order_csm => {
            if (order_csm.order_total_count_for_csm > 0)
               data_skeleton[order_csm.order_day - 1].pob_amount_combine = order_csm.order_total_count_for_csm;
        });

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
            data_skeleton[tour.tour_day - 1].tour_count = tour.tour_count;
        }

        this._user.tours = data_skeleton;
    }

    /**
     * show all tour for user
     *
     * @param user
     */
    showAllTourForUser() {
        this.showTour.emit();
    }
}
