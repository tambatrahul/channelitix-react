import {Component, Input, Output, EventEmitter} from "@angular/core";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {Customer} from "../../../../models/customer/customer";

@Component({
  selector: '[sale-plan]',
  styleUrls: ['sale_plan_component.component.less'],
  templateUrl: 'sale_plan_component.component.html'
})
export class SalePlanComponent extends ListComponent {

  /**
   * customer with planning details
   */
  _customer: Customer;

  /**
   * editing false
   */
  @Input()
  editing: boolean = false;

  /**
   * customer input details
   *
   * @param customer
   */
  @Input()
  set customer(customer: Customer) {
    this._customer = customer;
  }

  /**
   * when customer is updated trigger update
   *
   * @type {EventEmitter}
   */
  @Output()
  customerUpdated = new EventEmitter();

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
   * get total average primary for previous year
   *
   * @returns {any}
   */
  get total_avg_primary_previous_year() {
    return this._customer.plans[5].avg_primary_previous_year
      + this._customer.plans[2].avg_primary_previous_year
      + this._customer.plans[7].avg_primary_previous_year
      + this._customer.plans[0].avg_primary_previous_year;
  }

  /**
   * get total of previous month secondary sale
   *
   * @returns {any}
   */
  get total_previous_month_secondary() {
    return this._customer.plans[5].previous_month_secondary
      + this._customer.plans[2].previous_month_secondary
      + this._customer.plans[7].previous_month_secondary
      + this._customer.plans[0].previous_month_secondary;
  }

  /**
   * get total opening stock of current month
   *
   * @returns {any}
   */
  get total_opening_stock() {
    return this._customer.plans[5].opening_stock
      + this._customer.plans[2].opening_stock
      + this._customer.plans[7].opening_stock
      + this._customer.plans[0].opening_stock;
  }

  /**
   * get total primary plan
   *
   * @returns {any}
   */
  get total_primary_plan() {
    return this._customer.plans[5].primary_plan
      + this._customer.plans[2].primary_plan
      + this._customer.plans[7].primary_plan
      + this._customer.plans[0].primary_plan;
  }

  /**
   * get total primary plan
   *
   * @returns {any}
   */
  get total_secondary_plan() {
    return this._customer.plans[5].secondary_plan
      + this._customer.plans[2].secondary_plan
      + this._customer.plans[7].secondary_plan
      + this._customer.plans[0].secondary_plan;
  }

  /**
   * get next month opening inventory
   * @returns {number}
   */
  get next_month_opening_inv() {
    if (this.total_secondary_plan == 0)
      return 0;

    return ((this.total_opening_stock + this.total_primary_plan - this.total_secondary_plan) / this.total_secondary_plan) * 30
  }

  /**
   * inform parent about change in data
   */
  resetSave() {
    this.customerUpdated.emit();
  }
}
