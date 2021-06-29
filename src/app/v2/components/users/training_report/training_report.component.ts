import * as moment from "moment";
import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {FormComponent} from "../../../../components/base/form.component";
import {User} from "../../../../models/user/user";
import {AuthService} from "../../../../services/AuthService";
import {V2UserService} from "../../../../services/v2/user.service";
import { UserTrainingService } from "app/services/v2/user_training.service";
import { environment } from "environments/environment";
declare let jQuery: any;
declare let swal: any;

@Component({
  selector: 'training-report',
  templateUrl: 'training_report.component.html',
  providers: [UserTrainingService]
})
export class TrainingReportComponent extends FormComponent {

  /**
   * selected user
   */
  _user: User;

  /**
   * report deletion date
   */
  public report_date: string;

  /**
   *
   */
  public training_id: number = 0;

  /**
   * loading identifier
   */
  @ViewChild('deletingReport_modal')
  deletingReport_modal: ElementRef;

  /**
   * user to deactivate
   *
   * @type {number}
   */
  @Input()
  set user(user: User) {
    this._user = user;
    if (user.id) {
      jQuery(this.deletingReport_modal.nativeElement).modal();
    }
  }

  /**
   * get selected user
   *
   * @returns {User}
   */
  get user() {
    return this._user;
  }

  /**
   * event on user deactivating
   *
   * @type {EventEmitter}
   */
  @Output()
  trainingSelected = new EventEmitter();

  /**
   * user form
   *
   * @type {void|FormGroup}
   */
  public form = this._fb.group({
    training_id: []
  });

  /**
   * Delete Report user Constructor
   *
   * @param userTrainingService
   * @param _router
   * @param _fb
   * @param _service
   */
  constructor(public userTrainingService: UserTrainingService, public _router: Router, public _fb: FormBuilder,
              public _service: AuthService) {
    super(_service);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * Delete Report for user
   */
  save() {
    let self = this;
    this.submitted = true;
    if (this.form.valid) {
      let data = this.form.value;

      let training_id: number = Number(data.training_id);
      let full_name: string = self._user.full_name;
      let official_email: string = self._user.official_email;
      let email: string = self._user.email;
      let org_code: string = environment.orgCode;
      let id: number = self._user.id;
      let manager_email = self._user.managerOfficialEmail;

      // make server call
      swal({
        title: '',
        text: 'Send training?',
        type: 'info',
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
      }, function () {

        self.userTrainingService.trigger_user_trainings([{training_id, full_name, official_email, email, org_code, id, manager_email}]).subscribe(
          response => {
            swal({
              position: "center",
              title: "Training email has been sent to user",
              type: "success",
              timer: 1500,
              showConfirmButton: false
            });
            jQuery(self.deletingReport_modal.nativeElement).modal('hide');
            self.trainingSelected.emit(self._user);
          },
          err => {
            this.errors = err.errors;
            swal({
              title: 'Cannot able to send email to user',
              type: 'warning',
              showClass: {
                popup: 'animated fadeInDown faster'
              },
              hideClass: {
                popup: 'animated fadeOutUp faster'
              }
            });
          }
        );
      });
    }
  }

  /**
   * On training changed
   */
  trainingChanged(training_id) {
    this.training_id = training_id;
    this.form.patchValue({training_id: training_id});
  }
}
