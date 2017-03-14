import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppConstants} from "../../app.constants";
import {BaseSelectComponent} from "../pages/section/base-select.component";
import {CustomerService} from "../../services/customer.service";

@Component({
  selector: 'customer_grade-select',
  templateUrl: '../../templates/common/customer_grade-select.component.html'
})
export class CustomerGradeSelectComponent extends BaseSelectComponent{

  customer_grades: Array<Object> = [];

  /**
   * Title of input select field
   */
  @Input()
  title:string = "Select Customer Grade";

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
   * fetch customer grades from constants
   */
  fetch() {
    this.loading = true;
    this.customerService.masters().subscribe(
        response => {
          this.loading = false;
          this.customer_grades = response.customer_grades;
        },
        err => {
          this.loading = false;
        }
    );
  }
}
