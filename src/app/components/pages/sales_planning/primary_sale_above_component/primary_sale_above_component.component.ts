import {Component, Input} from "@angular/core";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {Customer} from "../../../../models/customer/customer";
import {Target} from "../../../../models/SAP/target";
import {Brand} from "../../../../models/order/brand";

@Component({
  selector: 'primary-sale-above',
  styleUrls: ['primary_sale_above_component.component.less'],
  templateUrl: 'primary_sale_above_component.component.html',
  inputs: ['refresh']
})
export class PrimarySaleAboveComponent extends ListComponent {

  /**
   * customer with planning details
   */
  _customers: Customer[];

  /**
   * Total customer object
   */
  _customer: Customer;

  /**
   *  Customer Above *0%
   */
  above_customers: Customer[];

  /**
   * year of sales planning
   */
  @Input()
  public year: number;

  /**
   * Total POB
   */
  pob_total: number = 0;

  /**
   * calculate total primary
   * @type {number}
   */
  calculate_total_primary: number = 0;

  /**
   * customers input details
   *
   * @param customers
   */
  @Input()
  set customers(customers: Customer[]) {
    this._customers = customers;
    this.format_data();
  }

  /**
   * customers input details
   *
   * @param customer
   */
  @Input()
  set total_customer(customer: Customer) {
    this._customer = customer;
    this.format_data();
    this.pob_target_total();
  }

  /**
   * brads wise planning
   *
   * @type {Array}
   */
  @Input()
  brands: Brand[] = [];

  /**
   * targets
   */
  @Input()
  targets: Target[];

  /**
   * constructor for Sale plan component
   *
   * @param _service
   */
  constructor(public _service: AuthService) {
    super(_service);
  }

  /**
   * fetch counts from server
   */
  protected fetch() {
  }

  /**
   * format data for display
   */
  protected format_data() {
    if (this._customers && this._customer) {
      // Total of All customers
      let total = PrimarySaleAboveComponent.total_avg_primary_previous_year(this._customer);

      if (total > 0)
        total = total * 0.8;

      // Total of single customer
      this._customers.map(cus => {
        cus.total_avg_previous_year = PrimarySaleAboveComponent.total_avg_primary_previous_year(cus);
      });

      // Sort customers list in descending order
      let customers: Customer[] = [];
      customers = this._customers.sort((a, b) =>
        b.total_avg_previous_year -
        a.total_avg_previous_year
      );

      customers = customers.filter(cus => cus.total_avg_previous_year > 0);

      let key = this.calculateIfTotalIsGreater(customers, total);

      // Get above 80% customers list
      this.above_customers = customers.slice(0, key);

      //Calculate Total of Primary Sale above 80%
      this.calculate_total_primary = 0;
      if (this.above_customers) {
        this.above_customers.map(cus => {
          this.calculate_total_primary += cus.total_avg_previous_year;
        });
      }
    }
  }

  /**
   * get total average primary for previous year
   *
   * @returns {any}
   */
  static total_avg_primary_previous_year(customer: Customer) {
    if (customer) {
      return customer.plans[10].avg_primary_previous_year
        + customer.plans[0].avg_primary_previous_year;
    }
    else
      return 0;
  }

  /**
   * Calculate if total is greater than the value
   * @param customers
   * @param total
   * @returns {Customer[]}
   */
  calculateIfTotalIsGreater(customers: Customer[], total: number): number {
    let cus_total = 0;
    let index;
    customers.map((cus, key) => {
      cus_total += cus.total_avg_previous_year;

      if (cus_total >= total && !index)
        index = key;
    });

    return index;
  }

  get calculateTotal() {
    let total: number = 0;

    if (this.above_customers) {
      this.above_customers.map(cus => {
        let avg = (cus.total_avg_previous_year / this.calculate_total_primary);
        total += avg;
      });
    }
    return total;
  }

  get calculateTotal2() {
    let total: number = 0;

    if (this.above_customers) {
      this.above_customers.map(cus => {
        let avg = ((cus.total_avg_previous_year / this.calculate_total_primary) * this.pob_total);
        total += avg;
      });
    }
    return total;
  }

  /**
   * POB Target Total
   */
  protected pob_target_total() {
    this.pob_total = 0;
    this.brands.map(brand => {
      // total calculate
      this.pob_total += brand.pob_target;
    });
  }

}
