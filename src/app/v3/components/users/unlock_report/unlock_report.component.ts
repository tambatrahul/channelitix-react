import * as moment from "moment";
import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {FormComponent} from "../../../../components/base/form.component";
import {User} from "../../../../models/user/user";
import {AuthService} from "../../../../services/AuthService";
import { UnlockReportService } from "app/services/v3/unlock_report.service";
import { environment } from "environments/environment";
declare let jQuery: any;
declare let swal: any;

@Component({
  selector: 'unlock-report',
  templateUrl: 'unlock_report.component.html',
  providers: [UnlockReportService]
})
export class UnlockReportComponent extends FormComponent {

  /**
   * selected user
   */
  _user: User;

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
  unlockReportingSelected = new EventEmitter();

  /**
   * Delete Report user Constructor
   *
   * @param userService
   * @param _router
   * @param _fb
   * @param _service
   */
  constructor(public userReportService: UnlockReportService, public _router: Router, public _fb: FormBuilder,
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

    let id: number = self._user.id;
  
    // make server call
    swal({
      title: '',
      text: 'Unlock Reporting function?',
      type: 'info',
      showCancelButton: true,
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      
      self.userReportService.unlockReportingforUser(id).subscribe(
        response => {
          swal({
            position: "center",
            title: "Reporting function is now unlocked for the user",
            type: "success",
            timer: 1500,
            showConfirmButton: false
          });
          jQuery(self.deletingReport_modal.nativeElement).modal('hide');
          self.unlockReportingSelected.emit(self._user);
        },
        err => {
          this.errors = err.errors;
          swal({
            title: 'Cannot able to unlock reporting for user',
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
