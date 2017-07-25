import {Component, Input} from "@angular/core";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {Customer} from "../../../../models/customer/customer";
import {Brand} from "../../../../models/order/brand";
import {Target} from "../../../../models/SAP/target";

@Component({
  selector: 'product-sale-plan',
  styleUrls: ['product_sale_plan_component.component.less'],
  templateUrl: 'product_sale_plan_component.component.html',
  inputs: ['refresh']
})
export class ProductSalePlanComponent extends ListComponent {

  /**
   * customer with planning details
   */
  _customer: Customer;

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
    this.brands.map(brand => {
      brand.primary_plan = this._customer.plans[brand.id].primary_plan;
      brand.secondary_plan = this._customer.plans[brand.id].secondary_plan;
      brand.opening = this._customer.plans[brand.id].opening_stock;

      this.targets.map(target => {
        if (target.brand_id == brand.id) {
          brand.month_target = target.total_target;
        }
        if ([5, 7, 2].indexOf(target.brand_id) < 0 && brand.id == 0 ) {
          brand.month_target += target.total_target;
        }
      });
    });
  }
}
