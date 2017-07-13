import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ListComponent} from "../../base/list.component";
import {AuthService} from "../../../services/AuthService";
import * as moment from "moment";
import {ReportService} from "../../../services/report.service";
import {Brick} from "../../../models/territory/brick";
import {Visit} from "../../../models/visit/visit";
import {Order} from "../../../models/order/order";
import {Target} from "../../../models/SAP/target";
import {Territory} from "../../../models/territory/territory";
import {environment} from "../../../../environments/environment";
declare let jQuery: any;

@Component({
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.less']
})
export class CustomerBrickCoverageComponent extends ListComponent {

  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public year: number;
  public territories: Territory[] = [];

  // set months object for visit, pob and target data
  public months: Object = {
    5: {order_total: 0}, 6: {order_total: 0}, 7: {order_total: 0}, 8: {order_total: 0},
    9: {order_total: 0}, 10: {order_total: 0}, 11: {order_total: 0}, 12: {order_total: 0}
  };

  // set months array
  public months_str = [
    "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];

  /**
   * region, territory, area, headquarter & brick id
   */
  public region_id: number = 0;
  public area_id: number = 0;
  public headquarter_id: number = 0;

  /**
   * User Component Constructor
   */
  constructor(public _service: AuthService, public route: ActivatedRoute, public reportService: ReportService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    super.ngOnInit();
    this.month = moment().month();
    this.year = moment().year();

    if(environment.envName=='geo'){
      this.region_id = 2;
      this.area_id = 3;
      this.headquarter_id = 4;
    }
    else {
      this.region_id = 1;
      this.area_id = 1;
      this.headquarter_id = 1;
    }
    this.fetch();
  }

  /**
   * load users for logged in user
   */
  fetch() {
    if (this.month && this.year) {
      this.months = {
        5: {order_total: 0}, 6: {order_total: 0}, 7: {order_total: 0}, 8: {order_total: 0},
        9: {order_total: 0}, 10: {order_total: 0}, 11: {order_total: 0}, 12: {order_total: 0}
      };
      this.reportService.brick_coverage(this.year, this.headquarter_id).subscribe(
        response => {

          // get bricks
          let bricks = response.bricks.map(brick => new Brick(brick));

          // get territories
          let territories = response.territories.map(territory => new Territory(territory));

          // get visits
          let visits = response.visits.map(visit => new Visit(visit));

          // get orders
          let orders = response.orders.map(order => new Order(order));

          // get targets
          let targets = response.targets.map(target => new Target(target));

          // prepare data for display
          this.prepareData(bricks, territories, visits, orders, targets);
        }
      );
    }
  }

  // Prepare Data For Display
  prepareData(bricks: Brick[], territories: Territory[], visits: Visit[], orders: Order[], targets: Target[]) {
    territories.map(ter => {
      ter.hq_bricks.map(brick => {
        brick.months = jQuery.extend({}, {5: {}, 6: {}, 7: {}, 8: {}, 9: {}, 10: {}, 11: {}, 12: {}});

        // set customer counts
        bricks.map(hq_brick => {
          if (brick.id == hq_brick.id) {
            if (hq_brick.customer_type_id == 1) {
              if (hq_brick.grade_id == 1 || hq_brick.grade_id == 2 || hq_brick.grade_id == 8 ||
                hq_brick.grade_id == 9 || hq_brick.grade_id == 10 || hq_brick.grade_id == 11) {
                hq_brick.customer_ab = hq_brick.customer_count;
              } else
                brick.customer_others = hq_brick.customer_count;
            }
            if (hq_brick.customer_type_id == 2) {
              brick.customer_semi = hq_brick.customer_count;
            }
            if (hq_brick.customer_type_id == 3) {
              brick.customer_retailer = hq_brick.customer_count;
            }
            if (hq_brick.customer_type_id == 4) {
              brick.customer_hub_chemist = hq_brick.customer_count;
            }
            if (hq_brick.customer_type_id == 5) {
              brick.customer_physician = hq_brick.customer_count;
            }
          }
        });

        // set visits
        visits.map(visit => {
          if (visit.hq_brick_id == brick.id) {
            if (brick.months.hasOwnProperty(visit.visit_month)) {
              brick.months[visit.visit_month].visit_no_of_days = visit.no_of_days;
            }
          }
        });

        // set pobs
        orders.map(order => {
          if (order.hq_brick_id == brick.id) {
            if (brick.months.hasOwnProperty(order.order_month)) {
              brick.months[order.order_month].order_total_count = order.order_total_count;
              if (order.order_total_count)
                this.months[order.order_month].order_total += order.order_total_count;
            }
          }
        });

        // set targets
        targets.map(target => {
          if (target.hq_headquarter_id == this.headquarter_id) {
            if (brick.months.hasOwnProperty(target.month))
              brick.months[target.month].target = ((target.total_target * 0.3) / 24);
          }
        });
      });
    });

    console.log(this.months);

    this.territories = territories;
  }

  /**
   * when region is changed filter list of customer
   * @param region_id
   */
  regionChanged(region_id) {
    this.region_id = region_id;
    this.areaChanged(0);
  }

  /**
   * when area is changed filter list of customer
   * @param area_id
   */
  areaChanged(area_id) {
    this.area_id = area_id;
    this.headquarterChanged(0);
  }


  /**
   * when headquarter is changed filter list of customer
   * @param headquarter_id
   */
  headquarterChanged(headquarter_id) {
    this.headquarter_id = headquarter_id;
    this.fetch();
  }

  /**
   * month and year changed
   *
   * @param date
   */
  monthYearChanged(date) {
    this.month = date.month;
    this.year = date.year;
    this.fetch();
  }
}
