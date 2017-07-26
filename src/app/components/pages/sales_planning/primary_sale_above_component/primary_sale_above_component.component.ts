import {Component, Input} from "@angular/core";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {Customer} from "../../../../models/customer/customer";

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
   * customers input details
   *
   * @param customers
   */
  @Input()
  set customer(customers: Customer[]) {
    this._customers = customers;
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
    this._customers.map(cus => {});
  }
}
