import {Component, ViewChild, ElementRef} from "@angular/core";
import {ListComponent} from "../../base/list.component";
import {AuthService} from "../../../services/AuthService";
import * as moment from "moment";
import {SalesPlanningService} from "../../../services/sales_planning.service";
import {Customer} from "../../../models/customer/customer";
import {SapStockistSale} from "../../../models/SAP/sap_stockist_sale";
import {SecondarySale} from "../../../models/sale/secondary_sale";
import {SalesPlanningDetail} from "../../../models/plan";
import {Brand} from "../../../models/order/brand";
import {Target} from "../../../models/SAP/target";
import {Order} from "../../../models/order/order";

declare let jQuery: any;

@Component({
  styleUrls: ['sales_planning.component.less'],
  templateUrl: 'sales_planning.component.html'
})
export class SalesPlanningComponent extends ListComponent {

  /**
   * month of sales planning
   */
  public month: number;

  /**
   * year of sales planning
   */
  public year: number;

  /**
   * editing false
   */
  editing: boolean = false;
  excel_loaded: boolean = false;

  /**
   * brands
   *
   * @type {Array}
   */
  brands: Brand[] = [];

  /**
   * Customer
   */
  customers: Customer[];

  /**
   * user tour program modal loading identifier
   */
  @ViewChild('summary_component')
  summary_component: ElementRef;

  /**
   * targets
   */
  targets: Target[];

  /**
   * get total customer
   *
   * @type {Customer}
   */
  total_customer: Customer = new Customer({firm_name: "Total"});

  /**
   * constructor for sales planning component
   *
   * @param _service
   * @param salesPlanningService
   */
  constructor(public _service: AuthService, private salesPlanningService: SalesPlanningService) {
    super(_service);
  }

  /**
   * initialize month and year
   */
  ngOnInit() {
    this.month = moment().month();
    this.year = moment().year();
    super.ngOnInit();
  }

  /**
   * fetch counts from server
   */
  protected fetch() {
    if ((this.month || this.month == 0) && this.year) {
      this.loading = true;
      this.salesPlanningService.monthly(this.month + 1, this.year).subscribe(
        response => {
          this.loading = false;

          // set customers
          this.customers = response.customers.map(cus => new Customer(cus));

          // get yearly sales
          let yearly_sales = response.yearly_sales.map(ys => new SapStockistSale(ys));

          // get secondary sales
          let secondary_sales = response.secondary_sales.map(ss => new SecondarySale(ss));

          // get planning details
          let sale_planning_details = response.sale_planning_details.map(ss => new SalesPlanningDetail(ss));

          let orders = response.orders.map(ord => new Order(ord));

          // get brands
          let brands = response.brands.map(brand => new Brand(brand)).filter(brand => {
            return [10].indexOf(brand.id) > -1;
          });

          // adding others brand
          brands.push(new Brand({id: 0, name: "GEO"}));
          this.brands = brands;

          // set targets
          this.targets = response.targets.map(target => new Target(target));

          // format data
          this.formatData(yearly_sales, secondary_sales, sale_planning_details, orders);
        },
        err => {
          this.loading = false;
        });
    }
  }

  /**
   * format planning data
   */
  protected formatData(yearly_sales: SapStockistSale[], secondary_sales: SecondarySale[],
                       sale_planning_details: SalesPlanningDetail[], orders: Order[]) {

    this.customers.map(cus => {

      // set yearly sales
      yearly_sales.map(ys => {
        if (ys.stockist_code == cus.code) {
          if (cus.plans.hasOwnProperty(ys.brand_id))
            cus.plans[ys.brand_id].avg_primary_previous_year = (ys.total_net_amt || 0) / 12;
          else
            cus.plans[0].avg_primary_previous_year += (ys.total_net_amt || 0) / 12;
        }
      });

      // set secondary sales for last month
      secondary_sales.map(ss => {
        if (ss.customer_id == cus.id) {
          if (cus.plans.hasOwnProperty(ss.brand_id)) {
            cus.plans[ss.brand_id].previous_month_secondary = ss.secondary_sale * ss.unit_price;
            cus.plans[ss.brand_id].opening_stock = ss.closing * ss.unit_price;
          } else {
            cus.plans[0].previous_month_secondary += ss.secondary_sale * ss.unit_price;
            cus.plans[0].opening_stock += ss.closing * ss.unit_price;
          }
        }
      });

      // set primary plan and secondary plan
      sale_planning_details.map(ss => {
        if (ss.customer_id == cus.id) {
          if (cus.plans.hasOwnProperty(ss.brand_id)) {
            cus.plans[ss.brand_id].primary_sale = ss.primary_sale;
            cus.plans[ss.brand_id].secondary_sale = ss.secondary_sale;
          } else {
            cus.plans[0].primary_sale += ss.primary_sale;
            cus.plans[0].secondary_sale += ss.secondary_sale;
          }
        }
      });

      // set primary plan and secondary plan
      orders.map(ord => {
        if (ord.delivered_by == cus.id) {
          if (cus.plans.hasOwnProperty(ord.brand_id)) {
            cus.plans[ord.brand_id].pob = ord.order_total_count;
          } else {
            cus.plans[0].pob += ord.order_total_count;
          }
        }
      });
    });

    // Total of single customer
    this.customers.map(cus => {
      cus.total_avg_previous_year = this.total_avg_primary_previous_year(cus);
    });

    // Sort customers list in descending order
    this.customers.sort((a, b) =>
      b.total_avg_previous_year -
      a.total_avg_previous_year
    );
    this.total_updated();

    setTimeout(() => {
      if (!this.excel_loaded) {
        this.excel_loaded = true;
        jQuery('#summary-planning').tableExport({
          formats: ['xlsx'],
          bootstrap: true,
          position: "top"
        });

        jQuery('#stockist-level-POB-target').tableExport({
          formats: ['xlsx'],
          bootstrap: true,
          position: "top"
        });
      }
    }, 1000);
  }

  /**
   * month and year changed
   *
   * @param date
   */
  monthYearChanged(date) {
    let current_month = moment().month(date.month).year(date.year);
    this.month = current_month.month();
    this.year = current_month.year();
    this.fetch();
  }

  /**
   * toggle editing
   */
  toggleEditing() {
    this.editing = !this.editing;
  }

  /**
   * get total average primary for previous year
   *
   * @returns {any}
   */
  total_updated() {
    let total_cus = new Customer({firm_name: "Total"});
    this.customers.map(cus => {
      total_cus.plans[10].avg_primary_previous_year += cus.plans[10].avg_primary_previous_year ? cus.plans[10].avg_primary_previous_year : 0;
      total_cus.plans[0].avg_primary_previous_year += cus.plans[0].avg_primary_previous_year ? cus.plans[0].avg_primary_previous_year : 0;

      total_cus.plans[10].previous_month_secondary += cus.plans[10].previous_month_secondary ? cus.plans[10].previous_month_secondary : 0;
      total_cus.plans[0].previous_month_secondary += cus.plans[0].previous_month_secondary ? cus.plans[0].previous_month_secondary : 0;

      total_cus.plans[10].opening_stock += cus.plans[10].opening_stock;
      total_cus.plans[0].opening_stock += cus.plans[0].opening_stock;

      total_cus.plans[10].primary_sale += cus.plans[10].primary_sale;
      total_cus.plans[0].primary_sale += cus.plans[0].primary_sale;

      total_cus.plans[10].pob += cus.plans[10].pob;
      total_cus.plans[0].pob += cus.plans[0].pob;

      total_cus.plans[10].secondary_sale += cus.plans[10].secondary_sale;
      total_cus.plans[0].secondary_sale += cus.plans[0].secondary_sale;
    });
    this.total_customer = total_cus;
  }

  /**
   * Save Data
   */
  protected save(status: string) {
    this.loading = true;
    this.salesPlanningService.save(this.customers, this.month + 1, this.year, status).subscribe(
      response => {
        this.loading = false;
        this.editing = false;
        this.fetch();
      },
      err => {
        this.loading = false;
      }
    );
  }

  /**
   * Show summary component
   */
  protected showSummary() {
    jQuery(this.summary_component.nativeElement).modal();
  }

  /**
   * get total average primary for previous year
   *
   * @returns {any}
   */
  total_avg_primary_previous_year(customer: Customer) {
    if (customer) {
      return customer.plans[10].avg_primary_previous_year
        + customer.plans[0].avg_primary_previous_year;
    }
    else
      return 0;
  }
}
