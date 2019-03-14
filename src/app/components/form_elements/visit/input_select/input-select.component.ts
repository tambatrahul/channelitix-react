import {Component, Input} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {VisitService} from "../../../../services/visit.service";
import {VisitInput} from "../../../../models/visit/visit_input";

@Component({
  selector: 'visit-input-select',
  templateUrl: 'input-select.component.html'
})
export class InputSelectComponent extends BaseSelectComponent {

  public inputs: VisitInput[] = [];
  /**
   * Title of input select field
   */
  @Input()
  title: string = null;

  /**
   * First value of options
   */
  @Input()
  first_value: string = 'Select Input';


  /**
   * Role Select Component with AuthService
   */
  constructor(private visitService: VisitService) {
    super();
  }

  fetch() {
    this.loading = true;
    this.visitService.masters()
      .subscribe(
        response => {
          this.loading = false;
          this.models = response.inputs;
        },
        err => {
          this.loading = false;
        }
      );
  }
}
