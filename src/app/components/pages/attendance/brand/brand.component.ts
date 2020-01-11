import {Component, ViewChild, ElementRef, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {ListComponent} from '../../../base/list.component';
import {Brand} from '../../../../models/order/brand';
import {Report} from '../../../../models/attendance/report';
import {Priority} from '../../../../models/visit/priority';
import {CustomerPriorities} from '../../../../models/visit/customer_priorities';
import {BaseAuthComponent} from '../../../base/base_auth.component';
import {AuthService} from '../../../../services/AuthService';


@Component({
  selector: 'brand-att-component',
  templateUrl: 'brand.component.html',
  styleUrls: ['brand.component.less']
})
export class BrandAttendanceComponent extends BaseAuthComponent implements OnChanges {
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

  ngOnChanges() {
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
