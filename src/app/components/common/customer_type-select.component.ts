import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppConstants} from "../../app.constants";
import {BaseSelectComponent} from "../pages/section/base-select.component";
import {CustomerService} from "../../services/customer.service";

@Component({
  selector: 'customer_type-select',
  templateUrl: '../../templates/common/customer_type-select.component.html'
})
export class CustomerTypeSelectComponent extends BaseSelectComponent{

  customer_types: Array<Object> = [];

  /**
   * Title of input select field
   */
  @Input()
  title:string = "Select Customer Type";

  /**
   * First value of options
   */
  @Input()
  first_value:string = "All";

  /**
   * Role Select Component with AuthService
   */
  constructor(private customerService: CustomerService) {
    super();
  }

  /**
   * fetch customer types from constants
   */
  fetch() {
    this.loading = true;
    this.customerService.masters().subscribe(
        response => {
          this.loading = false;
          this.customer_types = response.customer_types;
        },
        err => {
          this.loading = false;
        }
    );
  }
}
