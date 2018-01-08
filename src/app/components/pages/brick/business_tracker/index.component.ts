import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ListComponent} from "../../../base/list.component";
import {Area} from "../../../../models/territory/area";
import {Headquarter} from "../../../../models/territory/headquarter";
import {AuthService} from "../../../../services/AuthService";
import {ReportService} from "../../../../services/report.service";
import * as moment from "moment";
import {Observable} from "rxjs/Observable";
import {Order} from "../../../../models/order/order";
import {Visit} from "../../../../models/visit/visit";
import {Territory} from "../../../../models/territory/territory";

declare let jQuery: any;

@Component({
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.less']
})
export class BrickBusinessTrackerComponent extends ListComponent {

  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public year: number;

  /**
   * region, territory, area, headquarter & brick id
   */
  public region_id: number = 0;
  public area_id: number = 0;
  public headquarter_id: number = 0;
  public _headquarters: Headquarter[] = [];
  public _areas: Area[] = [];
  public territories: Territory[] = [];
  btn_loading: boolean = false;

  /**
   * User Component Cons3tructor
   */
  constructor(public _service: AuthService, public route: ActivatedRoute, public reportService: ReportService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    this.month = moment().month();
    this.year = moment().year();
    super.ngOnInit();
  }

  /**
   * load users for logged in user
   */
  fetch() {
    let month = this.month + 1;
    if (month && this.year) {
      this.loading = true;
      Observable.forkJoin(
        this.reportService.brick_business_tracer_by_date(month, this.year, this.headquarter_id, this.area_id, this.region_id),
        this.reportService.brick_business_tracer_by_year(this.year, this.headquarter_id, this.area_id, this.region_id)
      ).subscribe(data => {

        this.territories = data[0].territories.map(ter => new Territory(ter));

        // get orders by date
        let by_date_orders = data[0].orders.map(ord => new Order(ord));

        // get visits by date
        let by_date_visits = data[0].visits.map(vis => new Visit(vis));

        // get orders by year
        let by_year_orders = data[1].orders.map(ord => new Order(ord));

        // get visits by year
        let by_year_visits = data[1].visits.map(vis => new Visit(vis));

        // preparing data for display
        this.prepareData(by_date_orders, by_date_visits, by_year_orders, by_year_visits);

        this.loading = false;

      });
    }
  }

  /**
   * Prepare Data For Display
   *
   * @param {Order[]} by_date_orders
   * @param {Visit[]} by_date_visits
   * @param {Order[]} by_year_orders
   * @param {Visit[]} by_year_visits
   */
  prepareData(by_date_orders: Order[], by_date_visits: Visit[], by_year_orders: Order[], by_year_visits: Visit[]) {
    // Get All territories
    this.territories.map(ter => {
      ter.hq_bricks.map(brick => {

        // Set date wise visit count
        by_date_visits.map(vis => {
          // check for brick
          if (brick.id == vis.hq_brick_id) {

            // check visit date is set or not
            if (brick.vis_date) {

              // check v2 visit date set
              if (!brick.v2_vis_date) {
                brick.v2_vis_date = true;
                if (vis.customer_type_id == 2)
                  brick.v2_visit_count_semi = vis.visit_count;

                if (vis.customer_type_id == 3)
                  brick.v2_visit_count_retailer = vis.visit_count;

                if (vis.customer_type_id == 4)
                  brick.v2_visit_count_hub = vis.visit_count;

                if (vis.customer_type_id == 5)
                  brick.v2_visit_count_physician = vis.visit_count;
              }

            } else {
              if (!brick.v2_vis_date) {
                brick.vis_date = vis.visit_date;
                if (vis.customer_type_id == 2)
                  brick.v1_visit_count_semi = vis.visit_count;

                if (vis.customer_type_id == 3)
                  brick.v1_visit_count_retailer = vis.visit_count;

                if (vis.customer_type_id == 4)
                  brick.v1_visit_count_hub = vis.visit_count;

                if (vis.customer_type_id == 5)
                  brick.v1_visit_count_physician = vis.visit_count;
              }
            }
          }
        });

        // set order by date
        by_date_orders.map(order => {
          // check for brick
          if (brick.id == order.hq_brick_id) {
            // order date set or not
            if (brick.ord_date) {
              if (!brick.v2_ord_date) {
                brick.v2_ord_date = true;
                brick.v2_pob += +order.order_total_count;
              }
            } else {
              if (!brick.v2_ord_date) {
                brick.ord_date = order.order_date;
                brick.v1_pob += +order.order_total_count;
              }
            }
          }
        });

        // set yearly visit
        by_year_visits.map(vis => {
          if(brick.id == vis.hq_brick_id){
            if(vis.customer_type_id == 2)
              brick.cumulative_visit_count_semi = vis.visit_count;

            if(vis.customer_type_id == 3)
              brick.cumulative_visit_count_retailer = vis.visit_count;

            if(vis.customer_type_id == 4)
              brick.cumulative_visit_count_hub = vis.visit_count;

            if(vis.customer_type_id == 5)
              brick.cumulative_visit_count_physician = vis.visit_count;
          }
        });

        // set yearly orser
        by_year_orders.map(order => {
          if(brick.id == order.hq_brick_id)
            brick.cumulative_pob = order.order_total_count;
        });
      });
    });
  }

  /**
   * get headquarters
   */
  headquarters(data) {
    this._headquarters = data.headquarters;
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
