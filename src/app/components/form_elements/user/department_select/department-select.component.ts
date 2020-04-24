import {Component, Input} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {DepartmentService} from '../../../../services/department.service';

@Component({
  selector: 'department-select',
  templateUrl: 'department-select.component.html'
})
export class DepartmentSelectComponent extends BaseSelectComponent {

  /**
   * Title of input select field
   */
  @Input()
  title: string = "Select Department";

  /**
   * First value of options
   */
  @Input()
  first_value: string = "All";


  /**
   * Role Select Component with AuthService
   */
  constructor(private departmentService: DepartmentService) {
    super();
  }

  /**
   * fetch brands
   */
  fetch() {
    this.loading = true;
    this.departmentService.all()
      .subscribe(
        response => {
          this.loading = false;
          this.models = response.departments;
        },
        err => {
          this.loading = false;
        }
      );
  }
}
