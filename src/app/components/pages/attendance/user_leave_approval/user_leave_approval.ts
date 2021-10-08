import {Component} from '@angular/core';
import {AuthService} from "../../../../services/AuthService";
import {Router} from "@angular/router";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {UserInputPos} from '../../../../models/visit/user_input_pos';
import {AttendanceService} from '../../../../services/attendance.service';
import {Attendance} from '../../../../models/attendance/attendance';
import * as moment from 'moment';

declare let swal: any;

@Component({
  templateUrl: 'user_leave_approval.html',
  styleUrls: ['user_leave_approval.less']
})
export class UserLeaveApproval extends BaseAuthComponent {

  public leaves_data: Attendance [] = [];
  public input_id: number = 0;
  public user_id: number = 0;

  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public year: number;

  /**
   * Create customer Constructor
   *
   * @param attendanceService
   * @param _router
   * @param _service
   */
  constructor(private attendanceService: AttendanceService, public _router: Router, public  _service: AuthService) {
    super(_service);
  }

  /**
   * Add Default One Empty Input
   */
  ngOnInit() {

    this.month = moment().month();
    this.year = moment().year();

    if (this._service.user.id)
      this.user_id = this._service.user.id;
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.attendanceService.fetchPendingLeaveApproval(this.month + 1, this.year, this.user_id).subscribe(
      response => {
        this.leaves_data = response.attendances;
        this.loading = false;
      },
      err => {
        this.loading = false;
      }
    );

  }

  /**
   * month and year changed
   *
   * @param date
   */
  monthYearChanged(date) {
    this.month = date.month;
    this.year = date.year;
    this.fetch();
  }

  /**
   * Approved Customer
   */
  approvedLeave(id: number) {
    let self = this;
    swal({
      title: 'Are you sure?',
      text: 'You want to Approve this Leave',
      type: 'info',
      showCancelButton: true,
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      self.attendanceService.approveLeave(id).subscribe(
        response => {
          swal('Leave Approved');
          self.fetch();
        },
        err => {
        }
      );
    });
  }

  /**
   * Rejected Customer
   */
  rejectedLeave(id: number) {
    let self = this;
    swal({
      title: 'Are you sure?',
      text: 'You want to Reject this Leave',
      type: 'info',
      showCancelButton: true,
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      self.attendanceService.rejectedLeave(id).subscribe(
        response => {
          swal('Leave Rejected');
          self.fetch();
        },
        err => {
        }
      );
    });
  }

}
