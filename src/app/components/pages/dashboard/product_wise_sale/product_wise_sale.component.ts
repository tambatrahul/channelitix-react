import {Component, Input} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {ReportService} from "../../../../services/report.service";
import {Performance} from "../../../../models/SAP/performance";
import {Product} from "../../../../models/order/product";
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
   * products wise performance
   */
  products: Product[];

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
    if (this.environment.projectName == 'ASPIRA') {
      if ((self._month || self._month == 0) && self._year) {
        self.loading = true;
        self.reportService.product_wise_sale_aspira(self._month + 1, self._year,
          self._region_ids, self._area_ids, self._headquarter_ids, self._zone_ids, self._department_id).subscribe(
          response => {
            self.formatData(new Performance(response.performance));
            self.loading = false;
          }, err => {
            self.loading = false;
          }
        );
      }
    } else {
      if ((self._month || self._month == 0) && self._year) {
        self.loading = true;
          self.reportService.product_wise_sale(self._month + 1, self._year,
           self._region_ids, self._area_ids, self._headquarter_ids, self._zone_ids, self._department_id).subscribe(
          response => {
            self.formatData(new Performance(response.performance));
            self.loading = false;
          }, err => {
            self.loading = false;
          }
        );
      }
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
   * format performance data
   */
  protected formatData(performance: Performance) {
    let self = this;

    // get products
    let products: Product[] = performance.products;

    self.total_target = 0;
    self.total_geo_target = 0;
    self.total_icon_target = 0;
    // set target values
    performance.targets.map(function (target) {
      products.map(function (product) {
        if (product.brand_id == target.brand_id) {
          product.target = target.total_target;
          self.total_target += target.total_target;

          if (target.brand_id > 4)
            self.total_geo_target += target.total_target;

          if (target.brand_id <= 4)
            self.total_icon_target += target.total_target;
        }
      });
    });

    self.total_actual = 0;
    self.total_pending_actual = 0;
    self.total_last_year_month_actual = 0;
    self.total_last_month_geo_actual = 0;
    self.total_last_month_icon_actual = 0;
    self.total_geo_actual = 0;
    self.total_icon_actual = 0;
    self.total_pending_icon_actual = 0;
    self.total_pending_geo_actual = 0;
    // set performance values
    performance.secondary_sales.map(function (ss) {
      products.map(function (product) {
        if (product.brand_id == ss.brand_id) {
          product.performance = ss.total_amount;
          product.performance_pending = ss.total_pending_amount;
          self.total_actual += ss.total_amount;
          self.total_pending_actual += ss.total_pending_amount;

          if (ss.brand_id > 4)
            self.total_geo_actual += ss.total_amount;
            self.total_pending_geo_actual += ss.total_pending_amount;

          if (ss.brand_id <= 4)
            self.total_icon_actual += ss.total_amount;
            self.total_pending_icon_actual += ss.total_pending_amount;
        }
      })
    });

    self.total_actual_sales = 0;
    self.total_pending_actual_sales = 0;
    self.total_product_geo_actual = 0;
    self.total_pending_product_geo_actual = 0;
    self.total_product_icon_actual = 0;
    self.total_pending_product_icon_actual = 0;
    // set performance Total values
    performance.secondary_total_sales.map(function (sst) {
      products.map(function (product) {
        if (product.brand_id == sst.brand_id) {
          product.performance_total = sst.total_amount;
          product.performance_pending_total = sst.total_pending_amount;
          self.total_actual_sales += sst.total_amount;
          self.total_pending_actual_sales += sst.total_pending_amount;

          if (sst.brand_id > 4)
            self.total_product_geo_actual += sst.total_amount;
            self.total_pending_product_geo_actual += sst.total_pending_amount;

          if (sst.brand_id <= 4)
            self.total_product_icon_actual += sst.total_amount;
            self.total_pending_product_icon_actual += sst.total_pending_amount;

        }
      })
    });
    performance.last_year_this_month_secondary_sales.map(function (ss) {
      products.map(function (product) {
        if (product.brand_id == ss.brand_id) {
          product.last_year_month_performance = ss.total_amount;
          self.total_last_year_month_actual += ss.total_amount;

          if (ss.brand_id > 4)
            self.total_last_month_geo_actual += ss.total_amount;

          if (ss.brand_id <= 4)
            self.total_last_month_icon_actual += ss.total_amount;
        }
      })
    });

    self.total_pob = 0;
    self.total_geo_pob = 0;
    self.total_icon_pob = 0;
    // set performance values
    performance.orders.map(function (order) {
      products.map(function (product) {
        if (product.brand_id == order.brand_id) {
          product.total_pob = order.order_total_count;
          self.total_pob += order.order_total_count;

          if (order.brand_id > 4)
            self.total_geo_pob += order.order_total_count;

          if (order.brand_id <= 4)
            self.total_icon_pob += order.order_total_count;
        }
      })
    });

    self.till_month_total_target = 0;
    self.till_month_geo_total_target = 0;
    self.till_month_icon_total_target = 0;
    // set performance values
    performance.till_month_targets.map(function (target) {
      products.map(function (product) {
        if (product.brand_id == target.brand_id) {
          product.total_target = target.total_target;
          self.till_month_total_target += target.total_target;

          if(+target.brand_id > 4)
            self.till_month_geo_total_target += target.total_target;

          if(+target.brand_id <= 4)
            self.till_month_icon_total_target += target.total_target;
        }
      })
    });

    self.till_month_total_sale = 0;
    self.till_month_total_sale_geo = 0;
    self.till_month_total_sale_icon = 0;
    // set performance values
    performance.till_month_sales.map(function (sale) {
      products.map(function (product) {
        if (product.brand_id == sale.brand_id) {
          product.total_primary_sale = sale.total_net_amt;
          self.till_month_total_sale += sale.total_net_amt;

          if(sale.brand_id > 4)
            self.till_month_total_sale_geo += sale.total_net_amt;

          if(sale.brand_id <= 4)
            self.till_month_total_sale_icon += sale.total_net_amt;
        }
      })
    });

    this.products = products;
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
