import {Component, ElementRef, ViewChild} from '@angular/core';
import {BaseAuthComponent} from '../../../../base/base_auth.component';
import {AttendanceService} from '../../../../../services/attendance.service';
import {AuthService} from '../../../../../services/AuthService';
import {ExpenseService} from '../../../../../services/expense.service';
import * as moment from 'moment';
import {Expense} from '../../../../../models/expense/expense';
import {Attendance} from '../../../../../models/attendance/attendance';
import {Observable} from 'rxjs/Observable';
import {Visit} from '../../../../../models/visit/visit';
import {Holiday} from '../../../../../models/holiday';
import {User} from '../../../../../models/user/user';

declare let jQuery: any;
declare let swal: any;

@Component({
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.less']
})
export class UserExpenseComponent extends BaseAuthComponent {


  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public year: number;
  public day: number;

  expenses: Expense[] = [];
  attendances: Attendance[] = [];
  first_fortnight: boolean = false;
  second_fortnight: boolean = false;
  title: string = null;
  termsAndCondition: boolean = false;
  first_fortnight_manager_expense_status: string = null;
  second_fortnight_manager_expense_status: string = null;

  /**
   * loading identifier
   */
  @ViewChild('request_to_edit_modal')
  request_to_edit_modal: ElementRef;

  /**
   * User Component Constructor
   *
   */
  constructor(private attendanceService: AttendanceService,
              private expenseService: ExpenseService,
              public _service: AuthService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    super.ngOnInit();
    this.month = moment().month() - 1;
    this.year = moment().year();
    this.day = parseInt(moment().format('D'), null);

    this.first_fortnight = true;
    this.second_fortnight = true;
    // this.first_fortnight = false;
    // this.second_fortnight = false;
    // let current_month = moment().month();
    // if (this.day > 15 && this.day <= 25 && this.month == current_month) {
    //   this.first_fortnight = true;
    // } else if (this.month < current_month && this.day < 10 || this.day >= 28) {
    //   this.second_fortnight = true;
    // }

    this.fetchData();
  }

  /**
   *
   * @param date
   */
  formatDate(date) {
    return moment(date, 'YYYY-MM-DD').format('DD MMMM YYYY');
  }

  /**
   * fetch server data for visits
   */
  fetchData() {
    this.loading = true;
    Observable.forkJoin(
      this.attendanceService.monthly(this.month + 1, this.year),
      this.expenseService.monthly(this.month + 1, this.year)
    ).subscribe(data => {
      this.attendances = data[0].attendances.map(att => new Attendance(att));
      this.expenses = data[1].expenses.map(expense => new Expense(expense));

      this.prepareData();
      this.loading = false;

    }, err => {
      this.loading = false;
    });
  }

  /**
   * Prepare Data For Display
   */
  prepareData() {
    this.expenses.map(expense => {
      this.attendances.map(att => {
        if (att.created_by === expense.user_id && expense.date === att.date) {
          expense.work_type = att.work_type.name;
        }
      });
    });

    if (this.expenses && this.expenses[0]) {
      this.first_fortnight_manager_expense_status = this.expenses[0].manager_status;
    }

    if (this.expenses && this.expenses[16]) {
      this.second_fortnight_manager_expense_status = this.expenses[16].manager_status;
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

    this.fetchData();

    this.first_fortnight = true;
    this.second_fortnight = true;
    // this.first_fortnight = false;
    // this.second_fortnight = false;
    // let current_month = moment().month();
    // if (this.day > 15 && this.day <= 25 && this.month == current_month) {
    //   this.first_fortnight = true;
    // } else if (this.month < current_month && this.day < 10 || this.day >= 28) {
    //   this.second_fortnight = true;
    // }
  }

  /**
   * Expense Verified
   *
   * @param value
   */
  approve(value) {
    this.loading = true;
    let first_fortnight = false, second_fortnight = false;
    if (value === 'first_fortnight_expense') {
      first_fortnight = true;
    }
    if (value === 'second_fortnight_expense') {
      second_fortnight = true;
    }

    this.expenseService.approve(first_fortnight, second_fortnight, this.month + 1, this.year).subscribe(
      response => {
        this.loading = false;
        this.fetchData();
      },
      err => {
        this.loading = false;
      }
    );
  }

  /**
   * Rejecte Expense Verified
   *
   * @param value
   */
  reject(value) {
    this.loading = true;
    let first_fortnight = false, second_fortnight = false;
    if (value === 'first_fortnight_expense') {
      first_fortnight = true;
    }
    if (value === 'second_fortnight_expense') {
      second_fortnight = true;
    }
    this.expenseService.reject(first_fortnight, second_fortnight, this.month + 1, this.year).subscribe(
      response => {
        this.loading = false;
        this.fetchData();
      },
      err => {
        this.loading = false;
      }
    );
  }

  /**
   *
   * @param value
   */
  requestToEdit(value) {
    if (value === 'first_fortnight_expense') {
      this.title = 'Firstfortnight Expense';
    }

    if (value === 'second_fortnight_expense') {
      this.title = 'Secondfortnight Expense';
    }

    jQuery(this.request_to_edit_modal.nativeElement).modal();
  }

  requestToEditExpenseSend() {
    swal({
      title: 'Mail Send Successfully',
      text: 'I will close in 2 sec.',
      type: 'success',
      timer: 1500,
      showConfirmButton: false
    });
    jQuery(this.request_to_edit_modal.nativeElement).modal('hide');
  }
}
