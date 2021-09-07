import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ListComponent} from '../../base/list.component';
import {AuthService} from '../../../services/AuthService';
import * as moment from 'moment';
import {DownloadService} from '../../../services/download.service';
import {ReportService} from '../../../services/report.service';
import {Brick} from '../../../models/territory/brick';
import {Visit} from '../../../models/visit/visit';
import {Order} from '../../../models/order/order';
import {Target} from '../../../models/SAP/target';
import {Territory} from '../../../models/territory/territory';
import {environment} from '../../../../environments/environment';
import {Headquarter} from '../../../models/territory/headquarter';
import {Area} from '../../../models/territory/area';
import {BrickDownload} from '../../../models/download/brick_download';

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
  public year: number;
  public headquarter_name: string = '';
  public territories: Territory[] = [];
  public years = [2017, 2018, 2019, 2020, 2021];

  // set months object for visit, pob and target data
  public months: Object = {
    1: {order_total: 0}, 2: {order_total: 0}, 3: {order_total: 0}, 4: {order_total: 0},
    5: {order_total: 0}, 6: {order_total: 0}, 7: {order_total: 0}, 8: {order_total: 0},
    9: {order_total: 0}, 10: {order_total: 0}, 11: {order_total: 0}, 12: {order_total: 0}
  };

  // set months array
  public months_str = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
  ];

  /**
   * region, territory, area, headquarter & brick id
   */
  public zone_id: number = 0;
  public region_id: number = 0;
  public area_id: number = 0;
  public headquarter_id: number = 0;
  public _headquarters: Headquarter[] = [];
  public _areas: Area[] = [];
  btn_loading: boolean = false;
  public department_id: number = 0;
  public brick_report_id: number = 0;


  /**
   * User Component Cons3tructor
   */
  constructor(public _service: AuthService, public route: ActivatedRoute, public reportService: ReportService, public downloadService: DownloadService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    super.ngOnInit();
    this.year = moment().year();

    if (environment.envName == 'geo') {
      if (this._service.user.role_id == 4) {
        this.region_id = this._service.user.hq_region_id;
        this.area_id = this._service.user.hq_area_id;
      }
      if (this._service.user.role_id == 5) {
        this.region_id = this._service.user.hq_region_id;
      }
      if (this._service.user.role_id == 6) {
        this.zone_id = this._service.user.hq_zone_id;
      }

      if (this._service.user.role_id == 7) {
        this.zone_id = 1;
      }
    } else {
      if (this._service.user.role_id == 4) {
        this.region_id = this._service.user.hq_region_id;
        this.area_id = this._service.user.hq_area_id;
      }
      if (this._service.user.role_id == 5) {
        this.region_id = this._service.user.hq_region_id;
      }
      if (this._service.user.role_id == 6) {
        this.zone_id = this._service.user.hq_zone_id;
      }
      if (this._service.user.role_id == 7) {
        this.zone_id = 1;
      }

    }

    if (this._service.user.departments.length > 0)
      this.department_id = 0;

    if (this._service.user.departments.length > 0 && this._service.user.role_id == 6 )
      this.department_id = this._service.user.departments[0].pivot.department_id;
  }

  /**
   * load users for logged in user
   */
  fetch() {
    if (this.year) {
      this.loading = true;
      this.months = {
        1: {order_total: 0}, 2: {order_total: 0}, 3: {order_total: 0}, 4: {order_total: 0},
        5: {order_total: 0}, 6: {order_total: 0}, 7: {order_total: 0}, 8: {order_total: 0},
        9: {order_total: 0}, 10: {order_total: 0}, 11: {order_total: 0}, 12: {order_total: 0}
      };
      this.reportService.brick_coverage(this.year, this.headquarter_id, this.department_id).subscribe(
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
          this.loading = false;
        }
      );
    }
  }

  // Prepare Data For Display
  prepareData(bricks: Brick[], territories: Territory[], visits: Visit[], orders: Order[], targets: Target[]) {
    territories.map(ter => {
      ter.hq_bricks.map(brick => {
        brick.months = jQuery.extend({}, {
          1: {order_total_count: 0},
          2: {order_total_count: 0},
          3: {order_total_count: 0},
          4: {order_total_count: 0},
          5: {order_total_count: 0},
          6: {order_total_count: 0},
          7: {order_total_count: 0},
          8: {order_total_count: 0},
          9: {order_total_count: 0},
          10: {order_total_count: 0},
          11: {order_total_count: 0},
          12: {order_total_count: 0}
        });

        // set customer counts
        bricks.map(hq_brick => {
          if (brick.id == hq_brick.id) {
            if (hq_brick.customer_type_id == 1) {
              if (hq_brick.grade_name.includes('A') || hq_brick.grade_name.includes('B')) {
                brick.customer_ab += hq_brick.customer_count;
              } else {
                brick.customer_others += hq_brick.customer_count;
              }
            }
            if (hq_brick.customer_type_id == 2) {
              brick.customer_semi += hq_brick.customer_count;
            }
            if (hq_brick.customer_type_id == 3) {
              brick.customer_retailer += hq_brick.customer_count;
            }
            if (hq_brick.customer_type_id == 4) {
              brick.customer_hub_chemist += hq_brick.customer_count;
            }
            if (hq_brick.customer_type_id == 5) {
              brick.customer_physician += hq_brick.customer_count;
            }

            brick.total_customers += hq_brick.customer_count;
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
              if (order.order_total_count) {
                brick.months[order.order_month].order_total_count += order.order_total_count;
                this.months[order.order_month].order_total += order.order_total_count;
              }
            }
          }
        });

        // set targets
        targets.map(target => {
          if (target.hq_headquarter_id == this.headquarter_id) {
            if (brick.months.hasOwnProperty(target.month)) {
              brick.months[target.month].target = ((target.total_target * 0.5) / 24);
            }
          }
        });
      });
    });

    this.territories = territories;
  }

  /**
   * get areas
   */
  areas(data) {
    this._areas = data.areas;
  }

  /**
   * get headquarters
   */
  headquarters(data) {
    this._headquarters = data.headquarters;
  }

  /**
   * when region is changed filter list of customer
   * @param zone_id
   */
  zoneChanged(zone_id) {
    this.zone_id = zone_id;
    this.regionChanged(0);
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
    this.territories = [];
  }

  /**
   * department Filter
   *
   * @param department_id
   */
  departmentChanged(department_id) {
    this.department_id = department_id;
    this.fetch();
  }

  /**
   * Year Value Changed
   * @param year
   */
  onYearChanged(year) {
    this.year = year;
  }

  /**
   * get brick report id to download
   */
  brickReportChanged(brick_report_id) {
    this.brick_report_id = brick_report_id;
  }

  /**
   * Download Excel For Report
   */
  report_download() {
    let url = this.downloadService.report_download(this.brick_report_id, 2, 0, this.year, this.zone_id, this.region_id, this.area_id, this.headquarter_id, this.department_id);
    window.open(url, "_blank");
  }
}
