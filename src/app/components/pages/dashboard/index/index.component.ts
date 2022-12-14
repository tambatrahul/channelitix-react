import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import { BaseComponent } from '../../../base/base.component';
import { ReportService } from '../../../../services/report.service';
import { AuthService } from '../../../../services/AuthService';
import { AppConstants } from '../../../../app.constants';
import { Performance } from '../../../../models/SAP/performance';
import { Product } from '../../../../models/order/product';

declare let jQuery: any;

@Component({
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.less']
})
export class DashBoardComponent extends BaseComponent {

  /**
   * dates
   *
   * @type {}
   */
  dates = {
    from_date: '',
    to_date: '',
    year: ''
  };



  /**
   * total visit and total pob
   * @type {number}
   */
  public total_visits: number = 0;
  public total_pob: number = 0;
  public total_geo_pob: number = 0;
  public total_pob_sk: number = 0;
  public total_pob_synergy: number = 0;
  public productive_calls: number = 0;
  public total_actual: number = 0;
  public total_geo_actual: number = 0;
  public total_pob_to_actual_sales: number = 0;
  public total_pob_for_sale: number = 0;
  public brand_id: number = 0;
  public product_id: number = 0;
  public department_id: number = 0;
  public total_sample: number = 0;
  public refresh;
  public totalInputDistribution: number = 0;
  public pobToSalesRate: number = 0;
  public iconPobToSalesRate: number = 0;
  public chlPobToSalesRate: number = 0;

  /**
   * selected regions, areas and headquarters
   *
   * @type {Array}
   */
  public zone_ids: Array<number> = [];
  public region_ids: Array<number> = [];
  public area_ids: Array<number> = [];
  public headquarter_ids: Array<number> = [];

  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public year: number;

  /**
   * Sales data
   */
  fetchActualSale = AppConstants.debounce(function () {
    const self = this;
    if ((self.month || self.month == 0) && self.year) {
      self.loading = true;
      self.reportService.product_wise_actule_sale(self.month + 1, self.year,
        self.region_ids, self.area_ids, self.headquarter_ids, self.zone_ids, self.department_id).subscribe(
          response => {
            self.forData(new Performance(response.performance));
            self.loading = false;
          }, err => {
            self.loading = false;
          }
        );
    }
  }, 1000, false);

  /**
   * Dashboard Component Constructor
   */
  constructor(private reportService: ReportService, public _service: AuthService) {
    super();
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    this.month = moment().month();
    this.year = moment().year();
    if (this._service.user.hq_zone_id)
      this.zone_ids.push(this._service.user.hq_zone_id);
    if (this._service.user.hq_region_id)
      this.region_ids.push(this._service.user.hq_region_id);
    if (this._service.user.hq_area_id)
      this.area_ids.push(this._service.user.hq_area_id);

    if (this._service.user.departments.length > 0)
      this.department_id = 0;

    if (this._service.user.departments.length > 0 && (this._service.user.role_id == 6 || this._service.user.role_id == 8))
      this.department_id = this._service.user.departments[0].pivot.department_id;

    this.fetchActualSale();
  }

  /**
   * For sales data
   */
  forData(performance: Performance) {
    let self = this;
    // get products
    let products: Product[] = performance.products;
    self.total_pob_for_sale = 0;
    self.total_geo_pob = 0;
    // set performance values
    performance.orders.map(function (order) {
      products.map(function (product) {
        if (product.brand_id == order.brand_id) {
          product.total_pob = order.order_total_count;
          self.total_pob_for_sale += order.order_total_count;

          if (order.brand_id != 10)
            self.total_geo_pob += order.order_total_count;
        }
      });
    });

    performance.secondary_sales.map(function (ss) {
      products.map(function (product) {
        if (product.brand_id == ss.brand_id) {
          product.performance = ss.total_amount;
          self.total_actual += ss.total_amount;

          if (ss.brand_id != 10)
            self.total_geo_actual += ss.total_amount;

        }
      });
    });
    this.total_pob_to_actual_sales = (self.total_actual > 0) ? parseInt(((this.total_pob_for_sale / self.total_actual) * 100).toFixed(2)) : 0
    this.total_sample = 0;
    this.total_sample = performance.total_sample;
  }

  /**
   * On date change
   * @param dates
   */
  onDateChanged(dates) {
    this.total_pob = 0;
    this.total_actual = 0;
    this.dates = dates;
    this.fetchActualSale();
  }

  monthYearChanged(date) {
    this.total_pob = 0;
    this.total_actual = 0;
    let current_month = moment().month(date.month).year(date.year);
    this.month = current_month.month();
    this.year = current_month.year();
    this.fetchActualSale();
  }
  /**
   * total visit and pob values
   * @param data
   */
  totalVisitOrders(data) {
    this.total_visits = data.visits;
    this.total_pob = data.orders;
    this.totalInputDistribution = data.totalInputDistribution;
    this.pobToSalesRate = data.pobToSalesRate;
    this.chlPobToSalesRate = data.chlPobToSalesRate;
    this.iconPobToSalesRate = data.iconPobToSalesRate;
  }

  /**
   * zone selected action
   *
   * @param zone_ids
   */
  zoneSelected(zone_ids: Array<number>) {
    this.zone_ids = zone_ids;
    this.region_ids = [];
  }

  /**
   * region selected action
   *
   * @param region_ids
   */
  regionSelected(region_ids: Array<number>) {
    this.region_ids = region_ids;
    this.area_ids = [];
  }

  /**
   * Refresh Page
   */
  pageRefresh() {
    this.refresh = !this.refresh;
  }

  /**
   * area selected action
   *
   * @param area_ids
   */
  areaSelected(area_ids: Array<number>) {
    this.area_ids = area_ids;
    this.headquarter_ids = [];
  }

  /**
   * headquarter selected action
   *
   * @param headquarter_ids
   */
  headquarterSelected(headquarter_ids: Array<number>) {
    this.headquarter_ids = headquarter_ids;
  }

  /**
   * department Filter
   *
   * @param department_id
   */
  departmentChanged(department_id) {
    this.department_id = department_id;
    this.fetchActualSale();
  }
}
