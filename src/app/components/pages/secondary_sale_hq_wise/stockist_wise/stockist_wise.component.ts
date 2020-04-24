import {Component} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {SecondarySaleService} from "../../../../services/secondary_sale.service";
import {SecondarySale} from "../../../../models/sale/secondary_sale";
import {ActivatedRoute} from "@angular/router";
import * as moment from "moment";
import {Headquarter} from "../../../../models/territory/headquarter";
import {PrimarySale} from "../../../../models/sale/primary_sale";
import {Customer} from "../../../../models/customer/customer";
import {Order} from "../../../../models/order/order";

declare let jQuery: any;

@Component({
  templateUrl: 'stockist_wise.component.html',
  styleUrls: ['stockist_wise.component.less']
})
export class StockistWiseHqComponent extends ListComponent {

  fractionSize: string = '1.0-2';
  /**
   * year and month for calendar
   * @type {number}
   */
  month: number;

  /**
   * year
   */
  year: number;

  /**
   * total values
   */
  pob: number = 0;
  opening: number = 0;
  opening_value: number = 0;
  closing: number = 0;
  closing_value: number = 0;
  adjustment: number = 0;
  adjustment_amount: number = 0;
  secondary_sale: number = 0;
  secondary_value: number = 0;
  primary_sale: number = 0;
  primary_qty: number = 0;
  btn_loading: boolean = false;

  product_id: number;

  /**
   * title of page
   *
   * @returns {string}
   */
  public get title() {
    return moment().month(this.month).format('MMMM') + ", " + this.year;
  }

  /**
   * headquarter id
   */
  public _hq_id: number;
  public _area_id: number;
  public _region_id: number;
  public _department_id: number = 0;
  public headquarter: Headquarter;

  /**
   * secondary sales
   *
   * @type {Array}
   */
  public secondary_sales: SecondarySale[] = [];
  public primary_sales: PrimarySale[] = [];
  public customers = [];

  /**
   * User Component Constructor
   *
   */
  constructor(private saleService: SecondarySaleService, public _service: AuthService, public route: ActivatedRoute) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    super.ngOnInit();

    if (this._service.user.department.length > 0)
      this._department_id = this._service.user.department[0].pivot.department_id;

    this.fetch();

  }

  /**
   * fetch customer secondary sales from server
   */
  fetch() {
    this.route.params.subscribe(params => {
      this._department_id = params['department_id'];
      this._hq_id = params['hq_id'];
      this._area_id = params['area_id'];
      this._region_id = params['region_id'];
      this.month = parseInt(params['month']);
      this.year = parseInt(params['year']);
      this.product_id = 0;
      this.fetchSales();
    });
  }

  /**
   * fetch sales
   */
  fetchSales() {
    this.loading = true;
    this.saleService.stockist_wise(this.month + 1, this.year, this._hq_id,
      this._area_id, this._region_id, this.product_id, this._department_id).subscribe(
      response => {

        this.loading = false;

        // get primary sales
        let primary_sales = response.primary_sales.map(function (ps, index) {
          return new PrimarySale(ps)
        });

        // convert to models
        let secondary_sales = response.secondary_sales.map(function (ss, index) {
          return new SecondarySale(ss);
        });

        // get Orders
        let orders = response.orders.map(function (ord, index) {
          return new Order(ord);
        });

        // format data for display
        this.formatSecondarySale(secondary_sales, primary_sales, orders);
      },
      err => {
        this.loading = false;
      }
    );
  }

  /**
   *
   * @param secondary_sales
   * @param primary_sales
   * @param orders
   */
  protected formatSecondarySale(secondary_sales: SecondarySale[], primary_sales: PrimarySale[], orders: Order[]) {
    // initialize totals
    this.pob = 0;
    this.opening = 0;
    this.opening_value = 0;
    this.closing = 0;
    this.closing_value = 0;
    this.adjustment = 0;
    this.adjustment_amount = 0;
    this.secondary_sale = 0;
    this.secondary_value = 0;
    this.primary_sale = 0;
    this.primary_qty = 0;
    let customers = {};

    // Set Primary Sale In Customer
    for (let ps of primary_sales) {
      if (!customers.hasOwnProperty(ps.customer.id)) {
        customers[ps.customer.id] = {
          customer: new Customer(ps.customer),
          pob: 0,
          primary_qty: 0,
          primary_sale: 0,
          opening: 0,
          opening_value: 0,
          adjustment: 0,
          adjustment_amount: 0,
          secondary_sale: 0,
          secondary_amount: 0,
          closing_amount_hq: 0,
          closing: 0,
          closing_value: 0,
          unit_price: 0
        }
      }

      customers[ps.customer.id].primary_sale = ps.total_net_amount ? ps.total_net_amount : 0;
      customers[ps.customer.id].primary_qty = ps.total_qty ? ps.total_qty : 0;

      this.primary_sale += ps.total_net_amount;
      this.primary_qty += ps.total_qty;
    }

    // Set Secondary Sale Customer
    for (let sale of secondary_sales) {
      if (!customers.hasOwnProperty(sale.customer_id)) {
        customers[sale.customer_id] = {
          customer: new Customer(sale.customer),
          pob: 0,
          primary_qty: 0,
          primary_sale: 0,
          opening: 0,
          opening_value: 0,
          adjustment: 0,
          adjustment_amount: 0,
          secondary_sale: 0,
          secondary_amount: 0,
          closing_amount_hq: 0,
          closing: 0,
          closing_value: 0,
          unit_price: 0
        };
      }

      customers[sale.customer_id].opening = sale.opening;
      customers[sale.customer_id].opening_value = sale.opening_value;
      customers[sale.customer_id].adjustment = sale.adjustment;
      customers[sale.customer_id].adjustment_amount = sale.adjustment_amount;
      customers[sale.customer_id].secondary_sale = sale.secondary_sale;
      customers[sale.customer_id].secondary_amount = sale.secondary_amount;
      customers[sale.customer_id].closing = sale.closing;
      customers[sale.customer_id].closing_value = sale.closing_value;
      customers[sale.customer_id].unit_price = sale.unit_price;

      this.opening += sale.opening;
      this.opening_value += sale.opening_value;
      this.closing += sale.closing;
      this.closing_value += sale.closing_value;
      this.adjustment += sale.adjustment;
      this.adjustment_amount += sale.adjustment_amount;
      this.secondary_sale += sale.secondary_sale;
      this.secondary_value += sale.secondary_amount;
    }

    // set pob amount
    for (let ord of orders) {
      if (customers.hasOwnProperty(ord.delivered_by)) {
        customers[ord.delivered_by].pob = ord.order_total_count;
        this.pob += ord.order_total_count;
      }
    }

    this.customers = this.generateArray(customers);
  }

  // Generate Object To Array
  generateArray(obj) {
    return Object.keys(obj).map((key) => {
      return obj[key]
    });
  }

  /**
   * Download Excel For Executive Summary
   */
  download() {
    this.btn_loading = true;
    this.saleService.stockist_wise_excel_download(this.month + 1, this.year, this._hq_id, this._area_id, this._region_id, this.product_id, this._department_id).subscribe(
      response => {
        this.btn_loading = false;
        let blob: Blob = response.blob();

        // Doing it this way allows you to name the file
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "Stockist_Wise_Secondary_Sale.xls";
        link.click();

      },
      err => {
        this.btn_loading = false;
      }
    );
  }

  /**
   * month and year changed
   *
   * @param date
   */
  monthYearChanged(date) {
    this.month = date.month;
    this.year = date.year;
    this.fetchSales();
  }

  /**
   * Product Changed
   * @param product_id
   */
  onProductChanged(product_id) {
    this.product_id = product_id;
    this.fetchSales();
  }

  /*
   * Check P to S Ratio
   */
  PToSRatio(primary_sale, secondary_sale) {
    let ratio = 0;
    if (secondary_sale > 0)
      ratio = (primary_sale / secondary_sale) * 100;

    return ratio < 75 || ratio > 125;
  }
  /**
   * department Filter
   *
   * @param department_id
   */
  departmentChanged(department_id) {
    this._department_id = department_id;
    this.product_id = 0;
    this.fetchSales();
  }
}
