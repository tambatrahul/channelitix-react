import {Component} from '@angular/core';
import {BaseAuthComponent} from '../../../../base/base_auth.component';
import {AuthService} from '../../../../../services/AuthService';
import {ExpenseService} from '../../../../../services/expense.service';
import * as moment from 'moment';
import {Expense} from '../../../../../models/expense/expense';
import {Attendance} from '../../../../../models/attendance/attendance';
import {AppConstants} from '../../../../../app.constants';

@Component({
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.less']
})
export class ExpenseComponent extends BaseAuthComponent {


  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public year: number;
  public day: number;

  first_fortnight_expenses: Expense[] = [];
  second_fortnight_expenses: Expense[] = [];
  first_fortnight_attendances: Attendance[] = [];
  second_fortnight_attendances: Attendance[] = [];
  region_id: number = 0;
  area_id: number = 0;
  headquarter_id: number = 0;
  status: string;

  /**
   * Chart data
   */
  fetchData = AppConstants.debounce(function() {
    const self = this;
    self.loading = true;
    self.expenseService.forRep(self.month + 1, self.year, self.region_id, self.area_id, self.headquarter_id, self.status).subscribe(
      response => {
        self.first_fortnight_expenses = response.first_fortnight_expenses.map(function (first_fortnight_expense) {
          return new Expense(first_fortnight_expense);
        });
        self.second_fortnight_expenses = response.second_fortnight_expenses.map(function (second_fortnight_expense) {
          return new Expense(second_fortnight_expense);
        });

        self.first_fortnight_attendances = response.first_fortnight_attendances.map(function (attendance) {
          return new Attendance(attendance);
        });

        self.second_fortnight_attendances = response.second_fortnight_attendances.map(function (attendance) {
          return new Attendance(attendance);
        });

        self.prepareData();

        self.loading = false;
      },
      err => {
        self.loading = false;
      }
    );
  }, 1000, false);

  /**
   * User Component Constructor
   *
   */
  constructor(private expenseService: ExpenseService,
              public _service: AuthService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    super.ngOnInit();
    this.month = moment().month();
    this.year = moment().year();
    if(this._service.user.role_str == AppConstants.ROLE_THIRD_PARTY)
      this.region_id = this._service.user.hq_region_id;

    if(this._service.user.role_str == AppConstants.ROLE_ZSM)
      this.region_id = this._service.user.hq_region_id;

    if(this._service.user.role_str == AppConstants.ROLE_CSM)
      this.area_id = this._service.user.hq_area_id;

    this.fetchData();
  }

  /**
   * Prepare Data For Display
   */
  prepareData() {
    this.first_fortnight_expenses.map(first_fortnight_expense => {
      this.first_fortnight_attendances.map(att => {
        if (att.hq_headquarter_id === first_fortnight_expense.hq_headquarter_id) {
          first_fortnight_expense.no_of_working_days = att.attendance_count;
        }
      });
    });

    this.second_fortnight_expenses.map(second_fortnight_expense => {
      this.second_fortnight_attendances.map(att => {
        if (att.hq_headquarter_id === second_fortnight_expense.hq_headquarter_id) {
          second_fortnight_expense.no_of_working_days = att.attendance_count;
        }
      });
    });
  }

  /**
   * month and year changed
   *
   * @param date
   */
  monthYearChanged(date) {
    this.month = date.month;
    this.year = date.year;
    this.fetchData();
  }

  /**
   * when region is changed filter list of customer
   * @param region_id
   */
  regionChanged(region_id) {
    this.region_id = region_id;
    this.areaChanged(0);
    this.fetchData();
  }

  /**
   * when area is changed filter list of customer
   * @param area_id
   */
  areaChanged(area_id) {
    this.area_id = area_id;
    this.headquarterChanged(0);
    this.fetchData();
  }

  /**
   * when headquarter is changed filter list of customer
   * @param headquarter_id
   */
  headquarterChanged(headquarter_id) {
    this.headquarter_id = headquarter_id;
    this.fetchData();
  }

  /**
   * Set status
   * @param value
   */
  setStatus(value) {
    this.status = value;
    this.fetchData();
  }

  /**
   * Manager Expense Status Changed
   */
  managerStatusChanged() {
    this.fetchData();
  }
}
