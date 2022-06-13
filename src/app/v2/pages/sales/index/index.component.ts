import {Component, ViewChild, ElementRef} from '@angular/core';
import * as moment from 'moment';
import {AppConstants} from '../../../../app.constants';
import {AuthService} from '../../../../services/AuthService';
import {Holiday} from '../../../../models/holiday';
import {Observable} from 'rxjs/Rx';
import {SaleService} from '../../../../services/v2/sale.service';
import {ListComponent} from '../../../../components/base/list.component';

declare let jQuery: any;
declare let d3: any;
declare let swal: any;

@Component({
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.less']
})
export class DailySalesComponent extends ListComponent {

  /**
   * Daily Sales view flag
   * @type {boolean}
   */
  public sales_view: boolean = true;

  /**
   * region, area & headquarter
   */
  public zone_id: number = 0;
  public region_id: number = 0;
  public area_id: number = 0;
  public headquarter_id: number = 0;
  public brand_id: number = 0;
  // public prv_day_sales: number = 0;

  excel_loaded: boolean = false;
  btn_loading: boolean = false;
  date: number;
  public role_id: number = 0;
  public department_id: number = 0;
  public options: {};
  public chart_data = [];
  public month: number;
  public year: number;
  public list: string[] = [];
  public sales_data = [];
  public salesData = [];
  public daily_sales: {};



  /**
   * get date range
   *
   * @returns {Array<number>}
   */
  get dates(): Array<number> {
    let dates = [];
    for (let d = 1; d < 32; d++) {
      dates.push(d);
    }
    return dates;
  }

  /**
   * get title of table
   * @returns {string}
   */
  get title(): string {
    return moment().year(this.year).month(this.month).format('MMMM, YYYY');
  }

  /**
   * Component Constructor
   *
   */
  constructor(public salesService: SaleService, public _service: AuthService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {

    if (this._service.user.hq_zone_id)
      this.zone_id = this._service.user.hq_zone_id;
    super.ngOnInit();

    if(this._service.user.role_str == 'COUNTRY_MNG')
      this.zone_id = 1;

    if (this._service.user.departments.length > 0)
      this.department_id = 0;

    if (this._service.user.departments.length > 0 && this._service.user.role_id == 6 )
      this.department_id = this._service.user.departments[0].pivot.department_id;

    if(this._service.user.role_str == AppConstants.ROLE_THIRD_PARTY)
      this.region_id = this._service.user.hq_region_id;

    if(this._service.user.role_str == AppConstants.ROLE_ZSM)
      this.zone_id = this._service.user.hq_zone_id;

    if(this._service.user.role_str == AppConstants.ROLE_RSM)
      this.region_id = this._service.user.hq_region_id;

    if(this._service.user.role_str == AppConstants.ROLE_CSM)
      this.area_id = this._service.user.hq_area_id;

    this.month = moment().month();
    this.year = moment().year();
    this.fetch();
  }

  /**
   * load sales
   */
  fetch() {
    this.fetchData();
  }

  /**
   * fetch server data for daily sales
   */
  fetchData = AppConstants.debounce(function () {
    const self = this;
    self.sales_data = [];
    self.loading = true;
    self.salesService.daily_sales(self.zone_id, self.region_id, self.area_id, self.headquarter_id, self.brand_id)
      .subscribe(response => {
      self.daily_sales = response.daily_sales;

        for (const monthYear in self.daily_sales) {

          const monthly_sales = {};
          monthly_sales['month_year'] = monthYear;

          if (self.daily_sales[monthYear].length > 0) {
            monthly_sales['target'] = self.daily_sales[monthYear][0]['target'];
          }

          monthly_sales['days'] = [];
          let sum = 0;
          let prv_day_sales = 0;
          let growth_per = 0;
          self.daily_sales[monthYear].forEach((data) => {
            const day = {};
            sum = sum + parseFloat(data['sale']);
            growth_per = (sum - prv_day_sales ) / prv_day_sales;
            day['day'] = data['days'];
            day['actual_sales'] = data['sale'];
            day['sales'] = sum;
            day['growth'] = growth_per > 0 ? growth_per : 0 ;
            day['prv_day_sales'] = prv_day_sales;
            prv_day_sales = sum;
            monthly_sales['days'].push(day);
          });
          monthly_sales['total_sales'] = monthly_sales['days'][30]['sales'];
          monthly_sales['achievement'] = (monthly_sales['target']  > 0) ? parseFloat(((monthly_sales['total_sales'] / monthly_sales['target'] ) * 100).toFixed(2)) : 0 ;
          self.sales_data.push(monthly_sales);
        }
        const temp = self.sales_data[12];
        self.sales_data.splice(12, 1);
        self.sales_data.splice(0, 0 , temp);
      self.loading = false;
      }, err => {
      self.loading = false;
    });
  }, 1000, false);

  /**
   * Toggle sales view
   */
  toggleSalesView() {
    this.sales_view = !this.sales_view;
  }

  /**
   * month and year changed
   *
   * @param date
   */
  monthYearChanged(date) {
    this.month = date.month;
    this.year = date.year;
    this.excel_loaded = false;
    this.fetch();
  }


  /**
   * when region is changed filter list of customer
   * @param zone_id
   */
  zoneChanged(zone_id) {
    this.zone_id = zone_id;
    this.regionChanged(0);
    this.fetchData();
  }

  /**
   * when region is changed filter list of customer
   * @param region_id
   */
  regionChanged(region_id) {
    this.region_id = region_id;
    this.areaChanged(0);
    this.fetchData();
  }

  /**
   * when area is changed filter list of customer
   * @param area_id
   */
  areaChanged(area_id) {
    this.area_id = area_id;
    this.headquarterChanged(0);
    this.fetchData();
  }

  /**
   * when headquarter is changed filter list of customer
   * @param headquarter_id
   */
  headquarterChanged(headquarter_id) {
    this.headquarter_id = headquarter_id;
    this.fetchData();
  }

  /**
   * brand Filter
   *
   * @param brand_id
   */
  brandChanged(brand_id) {
    this.brand_id = brand_id;
    this.fetchData();
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

}
