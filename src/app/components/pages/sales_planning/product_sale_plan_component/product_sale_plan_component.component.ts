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

  month_ach: number = 0;
  month_target: number = 0;
  primary_plan: number = 0;
  secondary_plan: number = 0;
  system_pri_plan: number = 0;
  variance_target: number = 0;
  pob_target: number = 0;

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
    this.month_ach = 0;
    this.month_target = 0;
    this.primary_plan = 0;
    this.secondary_plan = 0;
    this.system_pri_plan = 0;
    this.variance_target = 0;
    this.pob_target = 0;

    this.brands.map(brand => {
      brand.primary_sale = this._customer.plans[brand.id].primary_sale;
      brand.secondary_sale = this._customer.plans[brand.id].secondary_sale;
      brand.opening = this._customer.plans[brand.id].opening_stock;

      brand.month_target = 0;
      this.targets.map(target => {
        if (target.brand_id == brand.id) {
          brand.month_target = target.total_target;
        }
        if ([5, 7, 2].indexOf(target.brand_id) < 0 && brand.id == 0) {
          brand.month_target += target.total_target;
        }
      });

      this.month_ach += ((brand.primary_sale / brand.month_target) * 100);
      this.month_target += brand.month_target;
      this.primary_plan += brand.primary_sale;
      this.secondary_plan += brand.secondary_sale;
      this.system_pri_plan += brand.system_primary_plan;
      this.variance_target += brand.variance_to_target;
      this.pob_target += brand.pob_target;
    });
  }

}
