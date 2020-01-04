import {Component, Input} from "@angular/core";
import {BaseAuthComponent} from "../../../../base/base_auth.component";
import {AuthService} from "../../../../../services/AuthService";
import {Attendance} from "../../../../../models/attendance/attendance";
import {ReportService} from "../../../../../services/report.service";
import {Tour} from "../../../../../models/tour_program/tour";
import {Visit} from "../../../../../models/visit/visit";
import {Order} from "../../../../../models/order/order";
import {User} from '../../../../../models/user/user';
declare let jQuery: any;

@Component({
  selector: 'deviation-report',
  templateUrl: 'deviation_report.component.html',
  styleUrls: ['deviation_report.component.less']
})
export class DeviationReportComponent extends BaseAuthComponent {

  excel_loaded;
  public working_with_attendance: string;

  /**
   * Attendance
   *
   * @type {Array}
   */
  attendances: Attendance[] = [];
  /**
   * User
   */
  _user: User;
  /**
   * User Id
   */
  public _user_id: number;
  public _role_str: string;
  public role_id: number;

  /**
   * user id to fetch data
   *
   * @type {number}
   */
  @Input()
  set user(_user: User) {
    this._user_id = _user.id;
    this._role_str = _user.role_str;
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
    if (this._user_id && this._month && this._year) {
      this.loading = true;
      this.reportService.deviation_report(this._month + 1, this._year, this._user_id).subscribe(
        response => {
          this.loading = false;

          console.log(response.attendances);
          // get attendances
          this.attendances = response.attendances.map(att => new Attendance(att));

          // visit and order formatting
          let visited_brick = response.visited_brick.map(visit => new Visit(visit));
          let visits = response.visits.map(visit => new Visit(visit));
          let orders = response.orders.map(order => new Order(order));

          // get tours
          let tours = response.tours.map(tour => new Tour(tour));

          // preparing data for display
          this.prepareData(visits, visited_brick, orders, tours);
        },
        err => {
          this.loading = false;
        }
      );
    }
  }

  prepareData(visits: Visit[], visited_brick: Visit[], orders: Order[], tours: Tour[]) {
    this.attendances.map(attendance => {
      console.log(attendance.date);
      visited_brick.map(visit => {
        if (visit.visit_date == attendance.date) {
          // Visited Brick
          attendance.visited_brick = visit.visited_brick;
        }
      });

      visits.map(visit => {
        if (visit.visit_date == attendance.date) {

          //Ttl Stockist met
          if (visit.customer_type_id == 1)
            attendance.stockist_met = visit.visit_count;

          //Ttl Semi met
          if (visit.customer_type_id == 2)
            attendance.semi_met = visit.visit_count;

          //Ttl Retailer met
          if (visit.customer_type_id == 3)
            attendance.retailer_met = visit.visit_count;

          //Ttl Hub Chemist met
          if (visit.customer_type_id == 4)
            attendance.hub_chemist_met = visit.visit_count;

          //Ttl Healthcare Providers met
          if (visit.customer_type_id == 5)
            attendance.healthcare_providers_met = visit.visit_count;

        }
      });

      orders.map(order => {
        if (order.order_date == attendance.date) {
          // POB
          attendance.pob_amount = order.order_day_total_count;
        }
      });

      tours.map(tour => {
        if (tour.date == attendance.date) {
          // Tour plan
          if (this._role_str === 'REGION_MNG' || this._role_str === 'AREA_MNG') {
            attendance.tour_plan = tour.working_with ? tour.working_with.full_name : '';
            attendance.working_with_id_tour = tour.working_with_ids;
          } else {
            attendance.tour_plan = tour.tour_plan;
          }
        }
      });
    });

    setTimeout(() => {
      if (this.excel_loaded) {
        this.excel_loaded.reset();
      } else {
        this.excel_loaded = jQuery(".deviation-table").tableExport({
          formats: ['xlsx'],
          bootstrap: true,
          position: "top"
        });
      }
    }, 1000);
  }

  public compare (wotk_type: string, a: string, b: string, c: [number], d: number) {
    if (this._role_str === 'REGION_MNG' || this._role_str === 'AREA_MNG') {
      return this.numberArrayCompare(wotk_type, c, d);
    }else
      return this.stringCompare(wotk_type, a, b);
  }
  /**
   * Compare Tour Plan And visited brick
   *
   * @returns {number}
   */
  public stringCompare(wotk_type: string, a: string, b: string) {
    // work plan meeting is not red
    if(wotk_type != 'Meeting' && wotk_type != 'Office Work/Admin' && wotk_type != 'Sales Closing' && wotk_type != 'Transit'){
      // compare string visited brick and Tour Plan
      if((a != null) && (b != null)){
        if(!b.includes(a))
          return '#f76e60';
      }else
        return '#f76e60';
    }
  }

/**
 * Compare Tour Plan  And Attendance working with
 *
 * @returns {number}
 */
public numberArrayCompare(wotk_type: string, a: [number], b: number) {
  if (wotk_type != 'Meeting' && wotk_type != 'Office Work/Admin' && wotk_type != 'Sales Closing'  && wotk_type != 'Transit') {
    if (a.indexOf(b) == -1) {
      return '#f76e60';
    } else
      return '#FFF';
  }
}
}
