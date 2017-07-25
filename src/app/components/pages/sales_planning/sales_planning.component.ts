import {Component} from "@angular/core";
import {ListComponent} from "../../base/list.component";
import {AuthService} from "../../../services/AuthService";
import * as moment from "moment";
import {SalesPlanningService} from "../../../services/sales_planning.service";
import {Customer} from "../../../models/customer/customer";
import {SapStockistSale} from "../../../models/SAP/sap_stockist_sale";
import {SecondarySale} from "../../../models/sale/secondary_sale";
import {SalesPlanningDetail} from "../../../models/plan";

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

  /**
   * Customer
   */
  customers: Customer[];

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
    if (this.month && this.year) {
      this.salesPlanningService.monthly(this.month + 1, this.year).subscribe(
        response => {
          // set customers
          this.customers = response.customers.map(cus => new Customer(cus));

          // get yearly sales
          let yearly_sales = response.yearly_sales.map(ys => new SapStockistSale(ys));

          // get secondary sales
          let secondary_sales = response.secondary_sales.map(ss => new SecondarySale(ss));

          // get planning details
          let sale_planning_details = response.sale_planning_details.map(ss => new SalesPlanningDetail(ss));

          // format data
          this.formatData(yearly_sales, secondary_sales, sale_planning_details);
        });
    }
  }

  /**
   * format planning data
   */
  protected formatData(yearly_sales: SapStockistSale[], secondary_sales: SecondarySale[],
                       sale_planning_details: SalesPlanningDetail[]) {

    this.customers.map(cus => {

      // set yearly sales
      yearly_sales.map(ys => {
        if (ys.stockist_code == cus.code) {
          if (cus.plans.hasOwnProperty(ys.brand_id))
            cus.plans[ys.brand_id].avg_primary_previous_year = (ys.total_net_amt || 0) / 12;
          else
            cus.plans[0].avg_primary_previous_year = (ys.total_net_amt || 0) / 12;
        }
      });

      // set secondary sales for last month
      secondary_sales.map(ss => {
        if (ss.customer_id == cus.id) {
          if (cus.plans.hasOwnProperty(ss.brand_id)) {
            cus.plans[ss.brand_id].previous_month_secondary = ss.secondary_sale * ss.unit_price;
            cus.plans[ss.brand_id].opening_stock = ss.closing * ss.unit_price;
          } else {
            cus.plans[0].previous_month_secondary = ss.secondary_sale * ss.unit_price;
            cus.plans[0].opening_stock = ss.closing_qty * ss.unit_price;
          }
        }
      });

      // set primary plan and secondary plan
      sale_planning_details.map(ss => {
        if (ss.customer_id == cus.id) {
          if (cus.plans.hasOwnProperty(ss.brand_id)) {
            cus.plans[ss.brand_id].primary_plan = ss.primary_plan;
            cus.plans[ss.brand_id].secondary_plan = ss.secondary_plan;
          } else {
            cus.plans[0].primary_plan = ss.primary_plan;
            cus.plans[0].secondary_plan = ss.secondary_plan;
          }
        }
      });
    });
    this.total_updated();
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
    this.total_customer.plans = {
      5: new SalesPlanningDetail({}),
      2: new SalesPlanningDetail({}),
      7: new SalesPlanningDetail({}),
      0: new SalesPlanningDetail({}),
    };
    this.customers.map(cus => {
      this.total_customer.plans[5].avg_primary_previous_year += cus.plans[5].avg_primary_previous_year;
      this.total_customer.plans[2].avg_primary_previous_year += cus.plans[2].avg_primary_previous_year;
      this.total_customer.plans[7].avg_primary_previous_year += cus.plans[7].avg_primary_previous_year;
      this.total_customer.plans[0].avg_primary_previous_year += cus.plans[0].avg_primary_previous_year;

      this.total_customer.plans[5].previous_month_secondary += cus.plans[5].previous_month_secondary;
      this.total_customer.plans[2].previous_month_secondary += cus.plans[2].previous_month_secondary;
      this.total_customer.plans[7].previous_month_secondary += cus.plans[7].previous_month_secondary;
      this.total_customer.plans[0].previous_month_secondary += cus.plans[0].previous_month_secondary;

      this.total_customer.plans[5].opening_stock += cus.plans[5].opening_stock;
      this.total_customer.plans[2].opening_stock += cus.plans[2].opening_stock;
      this.total_customer.plans[7].opening_stock += cus.plans[7].opening_stock;
      this.total_customer.plans[0].opening_stock += cus.plans[0].opening_stock;

      this.total_customer.plans[5].primary_plan += cus.plans[5].primary_plan;
      this.total_customer.plans[2].primary_plan += cus.plans[2].primary_plan;
      this.total_customer.plans[7].primary_plan += cus.plans[7].primary_plan;
      this.total_customer.plans[0].primary_plan += cus.plans[0].primary_plan;

      this.total_customer.plans[5].secondary_plan += cus.plans[5].secondary_plan;
      this.total_customer.plans[2].secondary_plan += cus.plans[2].secondary_plan;
      this.total_customer.plans[7].secondary_plan += cus.plans[7].secondary_plan;
      this.total_customer.plans[0].secondary_plan += cus.plans[0].secondary_plan;
    });
  }
}
