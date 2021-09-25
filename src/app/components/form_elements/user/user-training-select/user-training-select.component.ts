import {Component, Input} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {DepartmentService} from '../../../../services/department.service';
import { UserTrainingService } from "app/services/v2/user_training.service";
import { environment } from "environments/environment";

@Component({
  selector: 'user-training-select',
  templateUrl: 'user-training-select.component.html',
  providers: [UserTrainingService],

})
export class UserTrainingSelectComponent extends BaseSelectComponent {

  /**
   * Title of input select field
   */
  @Input()
  title: string = "Select Training";

  /**
   * First value of options
   */
  @Input()
  first_value: string = "All";

  /**
   * Role Select Component with AuthService
   */
  constructor(private userTrainingService: UserTrainingService) {
    super();
  }

  /**
   * fetch tranings
   */
  fetch() {
    this.loading = true;
    this.userTrainingService.fetch_user_trainings()
      .subscribe(
        response => {
          this.loading = false;
          this.models = response.trainings.filter(item => item.org_code == environment.orgCode);
        },
        err => {
          this.loading = false;
        }
      );
  }
}
