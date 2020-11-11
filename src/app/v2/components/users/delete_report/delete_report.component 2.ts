import * as moment from "moment";
import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {FormComponent} from "../../../../components/base/form.component";
import {User} from "../../../../models/user/user";
import {AuthService} from "../../../../services/AuthService";
import {V2UserService} from "../../../../services/v2/user.service";
declare let jQuery: any;
declare let swal: any;

@Component({
  selector: 'delete-report',
  templateUrl: 'delete_report.component.html'
})
export class DeleteReportComponent extends FormComponent {

  /**
   * selected user
   */
  _user: User;

  /**
   * report deletion date
   */
  public report_date: string;

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
  reportDeleted = new EventEmitter();

  /**
   * user form
   *
   * @type {void|FormGroup}
   */
  public form = this._fb.group({
    report_date: [""]
  });

  /**
   * Delete Report user Constructor
   *
   * @param userService
   * @param _router
   * @param _fb
   * @param _service
   */
  constructor(public userService: V2UserService, public _router: Router, public _fb: FormBuilder,
              public _service: AuthService) {
    super(_service);
  }

  ngOnInit() {
    super.ngOnInit();
    this.dateChanged(moment().format('DD MMMM YYYY'));
  }

  /**
   * Delete Report for user
   */
  save() {
    let self = this;
    this.submitted = true;
    if (this.form.valid) {
      let data = this.form.value;

      // format Report date
      if (data.report_date)
        data.report_date = moment(data.report_date, "DD MMMM YYYY").format('YYYY-MM-DD');

      // make server call
      swal({
        title: 'Are you sure?',
        text: 'You want to Delete Report for this date ',
        type: 'info',
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
      }, function () {
        self.userService.report_delete(data, self._user.id).subscribe(
          response => {
            swal({
              title: "Report Deleted Successfully",
              text: "I will close in 2 sec.",
              type: "success",
              timer: 1500,
              showConfirmButton: false
            });
            jQuery(self.deletingReport_modal.nativeElement).modal('hide');
            self.reportDeleted.emit(self._user);
          },
          err => {
            this.errors = err.errors;
            swal({
              title: 'Have never reported for this Date',
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
   * on reporting date changed
   */
  dateChanged(date) {
    this.report_date = date;
    this.form.patchValue({report_date: date});
  }
}
