import {Component} from '@angular/core';
import {VisitService} from "../../../../services/visit.service";
import {AuthService} from "../../../../services/AuthService";
import {Router} from "@angular/router";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {UserInputPos} from '../../../../models/visit/user_input_pos';
import * as moment from 'moment';

declare let swal: any;

@Component({
  selector: 'user-input-acknowledgment-select',
  templateUrl: 'user_input_acknowledgement.component.html',
  styleUrls: ['user_input_acknowledgement.component.less']
})
export class UserInputAcknowledgementComponent extends BaseAuthComponent {

  public input_pos: UserInputPos [] = [];
  public input_id: number = 0;
  public user_id: number = 0;

  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public year: number;

  /**
   * Resetting User Password
   */
  public input_pos_add: UserInputPos = new UserInputPos({});

  /**
   * Add Acknowledgment
   */
  addAcknowledgment(input_po) {
    this.input_pos_add = input_po;
  }

  /**
   * on user reset password
   *
   * @param data
   */
  onAddAcknowledgment(data) {
    this.input_pos_add = new UserInputPos({});
    this.fetch();
  }
  /**
   * Create customer Constructor
   *
   * @param visitService
   * @param _router
   * @param _service
   */
  constructor(private visitService: VisitService, public _router: Router, public  _service: AuthService) {
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
    if ((this.month || this.month == 0) && this.year) {
      this.loading = true;
      this.visitService.acknowledgment(this.month + 1, this.year, this.user_id).subscribe(
        response => {
          this.input_pos = response.input_pos;
          this.loading = false;
        },
        err => {
          this.loading = false;
        }
      );
    }
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

}
