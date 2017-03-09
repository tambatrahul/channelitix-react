import {Component, Output, EventEmitter, ViewChild, ElementRef} from "@angular/core";
import {CustomerService} from "../../../services/customer.service";
import {Customer} from "../../../models/customer/customer";
declare let jQuery: any;

@Component({
  selector: 'customer_count',
  templateUrl: '../../../templates/pages/section/count.component.html',
  styleUrls: ['../../../templates/less/customer.component.less']
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
   * Total customers
   */
  public total: number = 0;

  /**
   * selected customer type id
   *
   * @type {number}
   */
  private customer_type_id: number = 0;

  /**
   * customer list
   *
   * @type {Array}
   */
  public customers: Customer[] = [];

  constructor(private customerService: CustomerService) {
  }

  /**
   * Set loading variable
   * @param loading
   */
  set loading(loading) {
    if (loading)
      jQuery(this.loading_table.nativeElement).mask('loading');
    else
      jQuery(this.loading_table.nativeElement).unmask();
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
    let self = this;
    this.loading = true;
    this.customerService.counts().subscribe(
      response => {
        this.loading = false;
        this.customers = response.customers;
        this.customers.forEach(cus => self.total += cus.total_customers );
      },
      err => {
        this.loading = false;
      }
    );
  }

  /**
   * emit on change of value
   */
  onCustomerTypeChange(ct_id) {
    this.customer_type_id = ct_id;
    this.onCustomerTypeChanged.emit(ct_id);
  }
}
