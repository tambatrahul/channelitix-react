import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppConstants} from "../../../../../app.constants";
import {BaseSelectComponent} from "../../../section/base-select.component";
import {CustomerService} from "../../../../../services/customer.service";

@Component({
  selector: 'grade-select',
  templateUrl: 'grade-select.component.html'
})
export class GradeSelectComponent extends BaseSelectComponent{

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
  }
}
