import {Component, Input} from "@angular/core";
import {BaseAuthComponent} from "../../../../base/base_auth.component";
import {AuthService} from "../../../../../services/AuthService";
import {Attendance} from "../../../../../models/attendance/attendance";
import {ReportService} from "../../../../../services/report.service";
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

  excel_loaded;
  public working_with_id_attendance: Array<number> = [];

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
          attendance.tour_plan = tour.tour_plan;
          attendance.working_with_id_tour = tour.working_with_ids;
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

  /**
   * Compare Tour Plan And visited brick
   *
   * @returns {number}
   */
  public stringCompare(wotk_type: string, a: string, b: string) {
    // work plan meeting is not red
    if(wotk_type != "Meeting"){
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
  if (wotk_type != "Meeting") {
    if (a.indexOf(b) == -1) {
      return '#f76e60';
    } else
      return '#FFF';
  }
}
}
