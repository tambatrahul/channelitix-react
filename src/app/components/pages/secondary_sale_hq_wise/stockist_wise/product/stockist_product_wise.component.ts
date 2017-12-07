import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import * as moment from "moment";
import {ListComponent} from "../../../../base/list.component";
import {Headquarter} from "../../../../../models/territory/headquarter";
import {Product} from "../../../../../models/order/product";
import {SecondarySaleService} from "../../../../../services/secondary_sale.service";
import {AuthService} from "../../../../../services/AuthService";
import {SecondarySale} from "../../../../../models/sale/secondary_sale";
import {PrimarySale} from "../../../../../models/sale/primary_sale";
import {Customer} from "../../../../../models/customer/customer";

declare let jQuery: any;

@Component({
  templateUrl: 'stockist_product_wise.component.html',
  styleUrls: ['stockist_product_wise.component.less']
})
export class StockistProductWiseHqComponent extends ListComponent {

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

  customer: Customer;

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
  public _customer_id: number;
  public _hq_id: number;
  public _area_id: number;
  public _region_id: number;
  public headquarter: Headquarter;

  /**
   * secondary sales
   *
   * @type {Array}
   */
  public products: Product[] = [];


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
  }

  /**
   * fetch customer secondary sales from server
   */
  fetch() {
    this.route.params.subscribe(params => {
      this._customer_id = params['customer_id'];
      this._hq_id = params['hq_id'];
      this._area_id = params['area_id'];
      this._region_id = params['region_id'];
      this.month = parseInt(params['month']);
      this.year = parseInt(params['year']);
      this.fetchSales()
    });
  }

  /**
   * fetch sales
   */
  fetchSales() {
    this.loading = true;
    this.saleService.stockist_product_wise(this.month + 1, this.year, this._hq_id, this._area_id, this._region_id, this._customer_id).subscribe(
      response => {

        this.loading = false;
        // convert to models
        let secondary_sales = response.secondary_sales.map(function (ss, index) {
          return new SecondarySale(ss);
        });

        // get primary sales
        let primaries = response.primary_sales.map(function (ps, index) {
          return new PrimarySale(ps)
        });

        // convert to models
        this.products = response.products.map(function (product, index) {
          return new Product(product);
        });

        this.customer = new Customer(response.customer);

        // format data for display
        this.formatSecondarySale(secondary_sales, primaries);
      },
      err => {
        this.loading = false;
      }
    );
  }

  /**
   * format secondary sales
   *
   * @param secondary_sales
   * @param primaries
   */
  protected formatSecondarySale(secondary_sales: SecondarySale[], primaries: PrimarySale[]) {
    // initialize totals
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

    for (let pro of this.products) {
      for (let sale of secondary_sales) {
        if (pro.id == sale.product_id) {
          pro.unit_price = sale.unit_price;
          pro.opening = sale.opening;
          pro.opening_value = sale.opening_value;
          pro.adjustment = sale.adjustment;
          pro.adjustment_amount = sale.adjustment_amount;
          pro.secondary_sale = sale.secondary_sale;
          pro.secondary_amount = sale.secondary_amount;
          pro.closing = sale.closing;
          pro.closing_value = sale.closing_value;
          pro.uom = sale.uom;
        }
      }

      for (let ps of primaries) {
        if (pro.code == ps.prd_code) {
          pro.primary_sale = ps.total_net_amount;
          pro.primary_qty = ps.total_qty;
        }
      }

      this.opening += pro.opening;
      this.opening_value += pro.opening_value;
      this.closing += pro.closing;
      this.closing_value += pro.closing_value;
      this.primary_sale += pro.primary_sale;
      this.primary_qty += pro.primary_qty;
      this.adjustment += pro.adjustment;
      this.adjustment_amount += pro.adjustment_amount;
      this.secondary_sale += pro.secondary_sale;
      this.secondary_value += pro.secondary_amount;
    }
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
}
