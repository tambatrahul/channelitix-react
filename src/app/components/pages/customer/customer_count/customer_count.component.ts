import {Component, Output, EventEmitter, ViewChild, ElementRef, Input} from '@angular/core';
import {CustomerService} from '../../../../services/customer.service';
import {AppConstants} from '../../../../app.constants';

declare let jQuery: any;

@Component({
  selector: 'customer-count',
  templateUrl: 'customer_count.component.html',
  styleUrls: ['../index/index.component.less']
})
export class CustomerCountComponent {
  /**
   * loading identifier
   */
  @ViewChild('loading_box')
  loading_table: ElementRef;

  /**
   * event on customer_type changed
   *
   * @type {EventEmitter}
   */
  @Output()
  onCustomerTypeChanged = new EventEmitter();

  /**
   * region, territory, area, headquarter & brick id
   */
  public _zone_id: number = 0;
  public _region_id: number = 0;
  public _area_id: number = 0;
  public _territory_id: number = 0;
  public _headquarter_id: number = 0;
  public _brick_id: number = 0;

  @Input()
  set zone_id(zone_id: number) {
    this._zone_id = zone_id;
    this.fetch();
  }

  @Input()
  set region_id(region_id: number) {
    this._region_id = region_id;
    this.fetch();
  }

  @Input()
  set area_id(area_id: number) {
    this._area_id = area_id;
    this.fetch();
  }

  @Input()
  set territory_id(territory_id: number) {
    this._territory_id = territory_id;
    this.fetch();
  }

  @Input()
  set headquarter_id(headquarter_id: number) {
    this._headquarter_id = headquarter_id;
    this.fetch();
  }

  @Input()
  set brick_id(brick_id: number) {
    this._brick_id = brick_id;
    this.fetch();
  }

  /**
   * Total customers
   */
  public total: number = 0;

  /**
   * Total visits
   */
  public total_visits: number = 0;

  /**
   * selected customer type id
   *
   * @type {number}
   */
  customer_type_id: number = 0;

  /**
   * customer list
   *
   * @type {Array}
   */
  public customers = [];

  /**
   * Chart data
   */
  fetchData = AppConstants.debounce(function () {
    const self = this;
    self.loading = true;
    self.customerService.counts(self._region_id, self._area_id, self._headquarter_id,
      self._territory_id, self._brick_id, self._zone_id).subscribe(
      response => {
        self.loading = false;
        self.total = 0;
        self.total_visits = 0;
        self.customers = response.customers;
        self.customers.forEach(cus => self.total += parseInt(cus.total_customers));
        self.customers.forEach(cus => self.total_visits += parseInt(cus.visit_count))
        self.customer_type_id = 0;
      },
      err => {
        self.loading = false;
      }
    );
  }, 1000, false);

  constructor(private customerService: CustomerService) {
  }

  /**
   * Set loading variable
   * @param loading
   */
  set loading(loading) {
    if (loading) {
      jQuery(this.loading_table.nativeElement).mask('loading');
    } else {
      jQuery(this.loading_table.nativeElement).unmask();
    }
  }

  /**
   * on load of component load users
   */
  ngOnInit() {
    this.fetch();
  }

  /**
   * load customerTypes
   */
  fetch() {
    this.fetchData();
  }

  /**
   * emit on change of value
   */
  onCustomerTypeChange(ct_id) {
    this.customer_type_id = ct_id;
    this.onCustomerTypeChanged.emit(ct_id);
  }
}
