import {Component, Input} from "@angular/core";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {Customer} from "../../../../models/customer/customer";
import {Brand} from "../../../../models/order/brand";
import {Target} from "../../../../models/SAP/target";

@Component({
  selector: 'primary-sale-above',
  styleUrls: ['primary_sale_above_component.component.less'],
  templateUrl: 'product_sale_plan_component.component.html',
  inputs: ['refresh']
})
export class PrimarySaleAboveComponent extends ListComponent {

  /**
   * customer with planning details
   */
  _customer: Customer;

  /**
   * targets
   */
  @Input()
  targets: Target[];

  /**
   * customer input details
   *
   * @param customer
   */
  @Input()
  set customer(customer: Customer) {
    this._customer = customer;
    this.format_data();
  }

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

  }
}
