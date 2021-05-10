import {Component, Input} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {ReportService} from "../../../../services/report.service";
import {Performance} from "../../../../models/SAP/performance";
import {BrandWiseSummary} from "../../../../models/sale/brandwise_summary";
import {Product} from "../../../../models/order/product";
import {PrimarySale} from "../../../../models/sale/primary_sale";
import * as moment from "moment";
import {BaseDashboardComponent} from "../base_dashboard.component";
import {AppConstants} from '../../../../app.constants';

@Component({
  selector: 'product-wise-sale',
  styleUrls: ['product_wise_sale.component.less'],
  templateUrl: 'product_wise_sale.component.html',
  inputs: ['refresh']
})
export class ProductWiseSaleComponent extends BaseDashboardComponent {

  /**
   * total target and actual
   *
   * @type {number}
   */
  till_month_total_target: number = 0;
  total_target: number = 0;
  total_actual: number = 0;
  total_pending_actual: number = 0;
  total_actual_sales: number = 0;
  total_pending_actual_sales: number = 0;
  total_last_year_month_actual: number = 0;
  till_month_total_sale: number = 0;
  total_pob: number = 0;

  public lastmonth: string;
  public lasttolastmonth: string;
  public currentmonth: string;

  public total: BrandWiseSummary[];
  public brandwisesummary: BrandWiseSummary[];
  /**
   * total target and actual
   *
   * @type {number}
   */
  till_month_geo_total_target: number = 0;
  total_geo_target: number = 0;
  total_last_month_geo_actual: number = 0;
  total_geo_actual: number = 0;
  total_pending_geo_actual: number = 0;
  total_product_geo_actual: number = 0;
  total_pending_product_geo_actual: number = 0;
  till_month_total_sale_geo: number = 0;
  total_geo_pob: number = 0;

  /**
   * total target and actual Icon
   *
   * @type {number}
   */
  till_month_icon_total_target: number = 0;
  total_icon_target: number = 0;
  total_last_month_icon_actual: number = 0;
  total_icon_actual: number = 0;
  total_pending_icon_actual: number = 0;
  total_product_icon_actual: number = 0;
  total_pending_product_icon_actual: number = 0;
  till_month_total_sale_icon: number = 0;
  total_icon_pob: number = 0;


  /**
   * department_id
   */
  _department_id: number = 0;
  @Input()
  set department_id(department_id: number) {
    this._department_id = department_id;
    this.fetchProductWiseSale();
  }

  /**
   * month of invoice
   */
  public _month: number;
  @Input()
  set month(month: number) {
    this._month = month;
    this.fetchProductWiseSale();
  }

  /**
   * view quantity
   *
   * @type {number}
   * @private
   */
  _refresh: boolean;
  set refresh(refresh) {
    this._refresh = refresh;
    this.fetchProductWiseSale();
  }

  /**
   * year of invoice
   */
  public _year: number;
  @Input()
  set year(year: number) {
    this._year = year;
  }


  /**
   * region id for filter
   */
  _zone_ids: Array<number> = [];
  @Input()
  set zone_ids(zone_ids) {
    this._zone_ids = zone_ids;
    this.fetchProductWiseSale();
  };

  /**
   * region id for filter
   */
  _region_ids: Array<number> = [];
  @Input()
  set region_ids(region_ids) {
    this._region_ids = region_ids;
    this.fetchProductWiseSale();
  };

  /**
   * area id for filter
   */
  _area_ids: Array<number> = [];
  @Input()
  set area_ids(area_ids) {
    this._area_ids = area_ids;
    this.fetchProductWiseSale();
  };

  /**
   * headquarter id for filter
   */
  _headquarter_ids: Array<number> = [];
  @Input()
  set headquarter_ids(headquarter_ids) {
    this._headquarter_ids = headquarter_ids;
    this.fetchProductWiseSale();
  };


  /**
   * Chart data
   */
  fetchProductWiseSale = AppConstants.debounce(function () {
    const self = this;
    // if (this.environment.projectName == 'ASPIRA') {
    //   if ((self._month || self._month == 0) && self._year) {
    //     self.loading = true;
    //     self.reportService.product_wise_sale_aspira(self._month + 1, self._year,
    //       self._region_ids, self._area_ids, self._headquarter_ids, self._zone_ids, self._department_id).subscribe(
    //       response => {
    //         self.formatData(new Performance(response.performance));
    //         self.loading = false;
    //       }, err => {
    //         self.loading = false;
    //       }
    //     );
    //   }
    // } else {
    self.lastmonth = moment.months(self._month - 1);
    self.lasttolastmonth = moment.months(self._month - 2);
    self.currentmonth = moment.months(self._month);
      if ((self._month || self._month == 0) && self._year) {
        self.loading = true;
          self.reportService.product_wise_sale(self._month + 1, self._year,
          self._region_ids, self._area_ids, self._headquarter_ids, self._zone_ids, self._department_id).subscribe(
          response => {
            self.brandwisesummary = response.performance.brandWiseSales.map(b => new BrandWiseSummary(b));
            self.total = new BrandWiseSummary(response.performance.total);
            self.loading = false;
          }, err => {
            self.loading = false;
          }
        );
      }
    }, 1000, false);


  constructor(public _service: AuthService, private reportService: ReportService) {
    super(_service);
  }

  /**
   * initialize data
   */
  ngOnInit() {
    super.ngOnInit();
    let current_month = moment();
    this._month = current_month.month();
    this._year = current_month.year();

    this.fetchProductWiseSale();
  }

  /**
   * fetch counts from server
   */
  protected fetch() {

  }



  /**
   * month and year changed
   *
   * @param date
   */
  monthYearChanged(date) {
    let current_month = moment().month(date.month).year(date.year);
    this._month = current_month.month();
    this._year = current_month.year();
    this.fetchProductWiseSale();
  }


}
