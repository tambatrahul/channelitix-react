import {Component, Output, EventEmitter} from "@angular/core";
import {CustomerService} from "../../../services/customer.service";
import {Customer} from "../../../models/customer/customer";
import {AppConstants} from "../../../app.constants";

@Component({
  selector: 'customer_count',
  templateUrl: 'templates/customer_count.component.html',
  styleUrls: ['templates/less/index.component.less']
})
export class CustomerCountComponent {

  /**
   * event on customer_type changed
   *
   * @type {EventEmitter}
   */
  @Output()
  onCustomerTypeChanged = new EventEmitter();

  /**
   * selected customer type id
   *
   * @type {number}
   */
  private customer_type_id: number = 0;

  /**
   * loading for server call
   * @type {boolean}
   */
  private loading: boolean = false;

  /**
   * user list
   *
   * @type {Array}
   */
  public customers: Customer[] = [];

  constructor(private customerService: CustomerService) {
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
    this.loading = true;
    this.customerService.counts().subscribe(
      response => {
        this.loading = false;
        this.customers = response.customers;
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
