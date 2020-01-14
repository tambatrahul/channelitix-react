import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {Brand} from '../../../../models/order/brand';
import {Priority} from '../../../../models/visit/priority';
import {CustomerPriorities} from '../../../../models/visit/customer_priorities';
import {BaseAuthComponent} from '../../../base/base_auth.component';
import {AuthService} from '../../../../services/AuthService';

@Component({
  selector: 'app-brand-att-component',
  templateUrl: 'brand-att.component.html',
  styleUrls: ['brand-att.component.less']
})
export class AttendanceBrandComponent extends BaseAuthComponent implements OnChanges {
  refresh: boolean = false;
  public loc_brands;

  /**
   * Input brand
   *
   * @param brands
   */
  @Input()
  brands: Brand[];

  /**
   * Title of input select field
   */
  @Input()
  priority: Priority;

  /**
   * Title of input select field
   */
  @Input()
  priorities: CustomerPriorities[];

  /**
   * tour creation selection
   *
   * @type {EventEmitter}
   */
  @Output()
  brandSelected = new EventEmitter();

  /**
   * User Component Constructor
   *
   * @param _service
   */
  constructor(public _service: AuthService) {
    super(_service);
  }

  ngOnChanges(a) {
    let loc_brands = this.brands.map(b => b);
    const self = this;
    this.priorities.map(function (c) {
      if (self.priority && c.brand_id !== self.priority.brand_id) {
        loc_brands = loc_brands.filter(brand => brand.id != c.brand_id);
      }
    });
    this.loc_brands = loc_brands;
  }

  /**
   * selected Customer
   */

  // selected_customer: Report;

  /**
   * set brand list by id
   * @param brand_id
   */
  setBrandListBy(brand_id) {
    this.brandSelected.emit({brand_id: brand_id, priority: this.priority});
  }
}
