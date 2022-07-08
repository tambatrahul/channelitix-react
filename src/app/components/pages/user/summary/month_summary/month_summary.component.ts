import { Component, Input } from "@angular/core";
import { BaseAuthComponent } from "../../../../base/base_auth.component";
import { AuthService } from "../../../../../services/AuthService";
import { ReportService } from "../../../../../services/report.service";
import { Attendance } from "../../../../../models/attendance/attendance";
import { Order } from "../../../../../models/order/order";
import { Visit } from "../../../../../models/visit/visit";
import { Customer } from "../../../../../models/customer/customer";
import { User } from '../../../../../models/user/user';

declare let jQuery: any;

@Component({
  selector: 'month-summary',
  templateUrl: 'month_summary.component.html',
  styleUrls: ['month_summary.component.less']
})
export class MonthSummaryComponent extends BaseAuthComponent {

  // /**
  //  * User
  //  */
  // _users: User;

  /**
   * User Id
   */
  private _user_id: number;

  /**
   * year input
   */
  _month: number;
  _year: number;

  total_dr_meet: number = 0;
  total_semi_meet: number = 0;
  total_stockist_meet: number = 0;
  total_retailer_meet: number = 0;
  total_chemist_meet: number = 0;
  total_dr_met: number = 0;
  total_stockist_met: number = 0;
  total_semi_met: number = 0;
  total_chemist_met: number = 0;
  total_retailer_met: number = 0;
  total_stockist_meet_new: number = 0;
  total_dr_meet_new: number = 0;
  total_chemist_meet_new: number = 0;
  total_semi_meet_new: number = 0;
  total_retailer_meet_new :number = 0;
  dr_call_average: number = 0;
  chemist_call_average: number = 0;

  field_work_days: number = 0;
  leave: number = 0;
  transit: number = 0;
  total_pob: number = 0;
  total_pob_self: number = 0;
  total_pob_with: number = 0;
  total_visits: number = 0;

  /**
   * user id to fetch data
   *
   * @type {number}
   */
  @Input()
  set user_id(_user_id: number) {
    this._user_id = _user_id;
    this.reset();
    this.fetch();
  }

  _department_id: number = 0;
  @Input()
  set department_id(department_id: number) {
    this._department_id = department_id;
    this.reset();
    this.fetch();
  }
  //
  // /**
  //  * user to fetch data
  //  *
  //  * @type {number}
  //  */
  // @Input()
  // set user(users: User) {
  //   this._users = users;
  //   this.fetch();
  // }

  // /**
  //  * get user
  //  *
  //  * @returns {User}
  //  */
  // get user() {
  //   return this._users;
  // }

  @Input()
  set month(month: number) {
    this._month = month;
    this.reset();
    this.fetch();
  }

  @Input()
  set year(year: number) {
    this._year = year;
    this.reset();
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

      this.reportService.month_summary(this._month + 1, this._year, this._user_id, this._department_id).subscribe(
        response => {
          this.loading = false;

          // get pob amount
          let orders = response.orders.map(ord => new Order(ord));
          let orders_csm = response.orders_csm.map(ord_csm => new Order(ord_csm));

          // get unique customer visits count
          let visits = response.visits.map(vis => new Visit(vis));
          let new_visits = response.visits.map(vis => new Visit(vis));
          let all_visits = response.all_visits.map(vis => new Visit(vis));

          // get attendance count
          let attendances = response.attendances.map(att => new Attendance(att));
          let leave_counts = response.leave_counts.map(att => new Attendance(att));

          this.prepareData(orders, orders_csm, visits, attendances, all_visits, new_visits, leave_counts);
        },
        err => {
          this.loading = false;
        }
      );
    }
  }

  /**
   *
   * @param {Order[]} orders
   * @param {Order[]} orders_csm
   * @param {Visit[]} visits
   * @param {Attendance[]} attendances
   * @param all_visits
   * @param leave_counts
   * @param customers
   */
  prepareData(orders: Order[], orders_csm: Order[], visits: Visit[], attendances: Attendance[], all_visits: Visit[], new_visits: Visit[], leave_counts: Attendance[]) {

    // distinct visit count
    visits.map(vis => {
      if (vis.customer_type_id === 5)
        this.total_dr_meet += +vis.visit_count;
      if (vis.customer_type_id === 4)
        this.total_chemist_meet += +vis.visit_count;
      if (vis.customer_type_id === 1)
        this.total_stockist_meet += +vis.visit_count;
      if (vis.customer_type_id === 2)
        this.total_semi_meet += +vis.visit_count;
      if (vis.customer_type_id === 3)
        this.total_retailer_meet += +vis.visit_count;
    });

    // distinct visit count
    new_visits.map(vis => {
      if (vis.customer_type_id === 1)
        this.total_stockist_meet_new += +vis.all_visit_count;
      if (vis.customer_type_id === 2)
        this.total_semi_meet_new += +vis.all_visit_count;
      if (vis.customer_type_id === 3)
        this.total_retailer_meet_new += +vis.all_visit_count;
      if (vis.customer_type_id === 4)
        this.total_chemist_meet_new += +vis.all_visit_count;
      if (vis.customer_type_id === 5)
        this.total_dr_meet_new += +vis.all_visit_count;
    });

    // total visit count
    all_visits.map(all_visit => {
      if (all_visit.customer_type_id === 5)
        this.total_dr_met += +all_visit.visit_count;
      if (all_visit.customer_type_id === 4)
        this.total_chemist_met += +all_visit.visit_count;
      if (all_visit.customer_type_id === 1)
        this.total_stockist_met += +all_visit.visit_count;
      if (all_visit.customer_type_id === 2)
        this.total_semi_met += +all_visit.visit_count;
      if (all_visit.customer_type_id === 3)
        this.total_retailer_met += +all_visit.visit_count;

      this.total_visits += +all_visit.visit_count;
    });

    // attendance count
    attendances.map(att => {
      if (att.work_type_id === 2)
        this.field_work_days = +att.att_count;
      else if (att.work_type_id === 4)
        this.transit = +att.att_count;
    });

    // order count
    orders.map(ord => {
      if (ord.order_day_total_count > 0)
        this.total_pob_self += ord.order_day_total_count;
    });

    // order count for CSM
    orders_csm.map(ord_csm => {
      if (ord_csm.order_total_count_for_csm > 0)
        this.total_pob_with += ord_csm.order_total_count_for_csm;
    });

    // leave count
    leave_counts.map(leave => {
      this.leave += leave.att_count;
    });
  }

  /**
   * reset all field
   */
  reset() {
    this.total_dr_meet = 0;
    this.total_dr_met = 0;
    this.total_chemist_meet = 0;
    this.total_chemist_met = 0;
    this.total_retailer_met = 0;
    this.total_retailer_meet = 0;
    this.total_semi_met = 0;
    this.total_semi_meet = 0;
    this.total_stockist_met = 0;
    this.total_stockist_meet = 0;
    this.total_stockist_meet_new = 0;
    this.total_semi_meet_new = 0;
    this.total_retailer_meet_new  = 0;
    this.total_chemist_meet_new = 0;
    this.total_dr_meet_new = 0;
    this.dr_call_average = 0;
    this.chemist_call_average = 0;
    this.field_work_days = 0;
    this.leave = 0;
    this.transit = 0;
    this.total_pob = 0;
    this.total_pob_self = 0;
    this.total_pob_with = 0;
    this.total_visits = 0;
  }
}
