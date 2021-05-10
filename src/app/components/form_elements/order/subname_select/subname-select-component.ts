import {Component, Input} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {SubNameService} from '../../../../services/subname_service';

@Component({
  selector: 'subname-select',
  templateUrl: 'subname-select.component.html'
})
export class SubNameSelectComponent extends BaseSelectComponent {

  /**
   * Title of input select field
   */
  @Input()
  title: string = "Select Brand";

  /**
   * First value of options
   */
  @Input()
  first_value: string = "All";

  private _department_id: number = 0;


  /**
   * Department Filter
   *
   * @type {number}
   */
  @Input()
  set department_id(department_id) {
    this._department_id = department_id;
    this.fetch();
  }


  /**
   * Role Select Component with AuthService
   */
  constructor(private subnameService: SubNameService) {
    super();
  }

  /**
   * fetch brands
   */
  fetch() {
    this.loading = true;
    if (this._department_id > 0) {
      this.subnameService.subname(this._department_id)
        .subscribe(
          response => {
            this.loading = false;
            this.models = response.subname;
          },
          err => {
            this.loading = false;
          }
        );
    } else {
      this.subnameService.all()
        .subscribe(
          response => {
            this.loading = false;
            this.models = response.subname;
          },
          err => {
            this.loading = false;
          }
        );
    }
  }
}
