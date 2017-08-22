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
declare let jQuery: any;

@Component({
    selector: 'deviation-report',
    templateUrl: 'deviation_report.component.html',
    styleUrls: ['deviation_report.component.less']
})
export class DeviationReportComponent extends BaseAuthComponent {

    /**
     * output for tour program
     * @type {EventEmitter}
     */
    @Output()
    deviationReport = new EventEmitter();

    /**
     * Attendance
     *
     * @type {Array}
     */
    attendances: Attendance[] = [];

    /**
     * User Id
     */
    private _user_id: number;

    /**
     * user id to fetch data
     *
     * @type {number}
     */
    @Input()
    set user_id(_user_id: number) {
        this._user_id = _user_id;
        this.fetch();
    }

    /**
     * get user id
     *
     * @returns {User}
     */
    get user_id() {
        return this._user_id;
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
        if (this._user_id && this._month && this._year) {
            this.loading = true;
            this.reportService.deviation_report(this._month + 1, this._year, this._user_id).subscribe(
                response => {
                    this.loading = false;

                    // get attendances
                    this.attendances = response.attendances.map(att => new Attendance(att));

                    // visit and order formatting
                    let visits = response.visits.map(visit => new Visit(visit));
                    let orders = response.orders.map(order => new Order(order));

                    // get tours
                    let tours = response.tours.map(tour => new Tour(tour));

                    // preparing data for display
                    this.prepareData(visits, orders, tours);
                },
                err => {
                    this.loading = false;
                }
            );
        }
    }

    prepareData(visits: Visit[], orders: Order[], tours: Tour[]) {
        this.attendances.map(attendance => {

            visits.map(visit => {
                if(visit.visit_date == attendance.date){
                    // Visited Brick

                    //Ttl Stockist met

                    //Ttl Semi met

                    //Ttl Retailer met

                    //Ttl Hub Chemist met

                    //Ttl Healthcare Providers met

                }
            });

            orders.map(order => {
                if(order.order_date == attendance.date) {
                    // POB
                }
            });

            tours.map(tour => {
                if(tour.date == attendance.date) {
                    // Tour plan
                }
            });
        });


    }
}