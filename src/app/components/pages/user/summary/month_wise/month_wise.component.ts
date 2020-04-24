import {Component, Input} from "@angular/core";
import {BaseAuthComponent} from "../../../../base/base_auth.component";
import {AuthService} from "../../../../../services/AuthService";
import {ReportService} from "../../../../../services/report.service";
import {Attendance} from "../../../../../models/attendance/attendance";
import {Order} from "../../../../../models/order/order";
import {Visit} from "../../../../../models/visit/visit";
import {Customer} from "../../../../../models/customer/customer";
declare let jQuery: any;

@Component({
    selector: 'month-wise',
    templateUrl: 'month_wise.component.html',
    styleUrls: ['month_wise.component.less']
})
export class MonthWiseReportComponent extends BaseAuthComponent {

    /**
     * User Id
     */
    private _user_id: number;

    /**
     * year input
     */
    _year: number;

    // set months array
    public months_str = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    // pob amount
    public months: Object = {
        1: {pob_amount: 0, call_average: 0, coverage: 0}, 2: {pob_amount: 0, call_average: 0, coverage: 0},
        3: {pob_amount: 0, call_average: 0, coverage: 0}, 4: {pob_amount: 0, call_average: 0, coverage: 0},
        5: {pob_amount: 0, call_average: 0, coverage: 0}, 6: {pob_amount: 0, call_average: 0, coverage: 0},
        7: {pob_amount: 0, call_average: 0, coverage: 0}, 8: {pob_amount: 0, call_average: 0, coverage: 0},
        9: {pob_amount: 0, call_average: 0, coverage: 0}, 10: {pob_amount: 0, call_average: 0, coverage: 0},
        11: {pob_amount: 0, call_average: 0, coverage: 0}, 12: {pob_amount: 0, call_average: 0, coverage: 0}
    };
    // Call Average
    public call_averages = [];

    // Coverage
    public coverages = [];

  _department_id: number = 0;
  @Input()
  set department_id(department_id: number) {
    this._department_id = department_id;
    this.fetch();
  }
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
        if (this._user_id && this._year) {
            this.loading = true;
            this.months = {
                1: {pob_amount: 0, call_average: 0, coverage: 0}, 2: {pob_amount: 0, call_average: 0, coverage: 0},
                3: {pob_amount: 0, call_average: 0, coverage: 0}, 4: {pob_amount: 0, call_average: 0, coverage: 0},
                5: {pob_amount: 0, call_average: 0, coverage: 0}, 6: {pob_amount: 0, call_average: 0, coverage: 0},
                7: {pob_amount: 0, call_average: 0, coverage: 0}, 8: {pob_amount: 0, call_average: 0, coverage: 0},
                9: {pob_amount: 0, call_average: 0, coverage: 0}, 10: {pob_amount: 0, call_average: 0, coverage: 0},
                11: {pob_amount: 0, call_average: 0, coverage: 0}, 12: {pob_amount: 0, call_average: 0, coverage: 0}
            };
            this.reportService.month_wise(this._year, this._user_id, this._department_id).subscribe(
                response => {
                    this.loading = false;

                    // get pob amount
                    let orders = response.orders.map(ord => new Order(ord));

                    // get all visits count
                    let all_visits = response.all_visits.map(vis => new Visit(vis));

                    // get unique customer visits count
                    let visits = response.visits.map(vis => new Visit(vis));

                    // get customer count
                    let customer = response.customer_total;

                    // get attendance count
                    let attendances = response.attendances.map(att => new Attendance(att));

                    // preparing data for display
                    this.prepareData(orders, all_visits, visits, customer, attendances);
                },
                err => {
                    this.loading = false;
                }
            );
        }
    }

    /**
     * Months Wise POB Amount, Call Average and Coverage
     *
     * @param orders
     * @param all_visits
     * @param visits
     * @param customer_total
     * @param attendances
     */
    prepareData(orders: Order[], all_visits: Visit[], visits: Visit[], customer_total: number, attendances: Attendance[]) {

        // set POB Amount
        orders.map(order => {
            for (let i = 1; i <= 12; i++) {
                if (order.order_month == i)
                    this.months[i].pob_amount = order.order_day_total_count;
            }
        });

        // set call average
        all_visits.map(visit => {
            attendances.map(att => {
                if (att.att_month == visit.visit_month) {
                    for (let i = 1; i <= 12; i++) {
                        if (visit.visit_month == i)
                            this.months[i].call_average = (visit.visit_count / att.att_count);
                    }
                }
            });
        });

        // set Coverage
        visits.map(visit => {
            for (let i = 1; i <= 12; i++) {
                if (visit.visit_month == i)
                    this.months[i].coverage = (visit.visit_count / customer_total);
            }
        });
    }
}
