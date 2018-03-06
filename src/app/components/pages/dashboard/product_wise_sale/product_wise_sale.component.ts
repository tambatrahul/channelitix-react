import {Component, Input} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {ReportService} from "../../../../services/report.service";
import {Performance} from "../../../../models/SAP/performance";
import {Product} from "../../../../models/order/product";
import * as moment from "moment";
import {BaseDashboardComponent} from "../base_dashboard.component";

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
  till_month_total_sale: number = 0;
  total_pob: number = 0;

  /**
   * total target and actual
   *
   * @type {number}
   */
  till_month_geo_total_target: number = 0;
  total_geo_target: number = 0;
  total_geo_actual: number = 0;
  till_month_total_sale_geo: number = 0;
  total_geo_pob: number = 0;

  /**
   * month of invoice
   */
  public _month: number;
  @Input()
  set month(month: number) {
    this._month = month;
    this.fetch();
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
    this.fetch();
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
    this.fetch();
  }

  /**
   * fetch counts from server
   */
  protected fetch() {
    if ((this._month || this._month == 0) && this._year) {
      this.loading = true;
      this.reportService.product_wise_sale(this._month + 1, this._year,
        this._region_ids, this._area_ids, this._headquarter_ids).subscribe(
        response => {
          this.formatData(new Performance(response.performance));
          this.loading = false;
        }, err => {
          this.loading = false;
        }
      );
    }
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
    // set target values
    performance.targets.map(function (target) {
      products.map(function (product) {
        if (product.brand_id == target.brand_id) {
          product.target = target.total_target;
          self.total_target += target.total_target;

          if (target.brand_id != 10)
            self.total_geo_target += target.total_target;
        }
      });
    });

    self.total_actual = 0;
    self.total_geo_actual = 0;
    // set performance values
    performance.secondary_sales.map(function (ss) {
      products.map(function (product) {
        if (product.brand_id == ss.brand_id) {
          product.performance = ss.total_amount;
          self.total_actual += ss.total_amount;

          if (ss.brand_id != 10)
            self.total_geo_actual += ss.total_amount;
        }
      })
    });

    self.total_pob = 0;
    self.total_geo_pob = 0;
    // set performance values
    performance.orders.map(function (order) {
      products.map(function (product) {
        if (product.brand_id == order.brand_id) {
          product.total_pob = order.order_total_count;
          self.total_pob += order.order_total_count;

          if (order.brand_id != 10)
            self.total_geo_pob += order.order_total_count;
        }
      })
    });

    self.till_month_total_target = 0;
    self.till_month_geo_total_target = 0;
    // set performance values
    performance.till_month_targets.map(function (target) {
      products.map(function (product) {
        if (product.brand_id == target.brand_id) {
          product.total_target = target.total_target;
          self.till_month_total_target += target.total_target;

          if(+target.brand_id != 10)
            self.till_month_geo_total_target += target.total_target;
        }
      })
    });

    self.till_month_total_sale = 0;
    self.till_month_total_sale_geo = 0;
    // set performance values
    performance.till_month_sales.map(function (sale) {
      products.map(function (product) {
        if (product.brand_id == sale.brand_id) {
          product.total_primary_sale = sale.total_net_amt;
          self.till_month_total_sale += sale.total_net_amt;

          if(sale.brand_id != 10)
            self.till_month_total_sale_geo += sale.total_net_amt;
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
    this.fetch();
  }
}
