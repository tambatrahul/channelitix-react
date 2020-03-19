import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Expense} from '../../../../../../models/expense/expense';
import {ListComponent} from '../../../../../base/list.component';
import {AuthService} from '../../../../../../services/AuthService';
import {ExpenseService} from '../../../../../../services/expense.service';
import * as moment from 'moment';
import {Attendance} from '../../../../../../models/attendance/attendance';

@Component({
  selector: 'app-view-expense-modal',
  templateUrl: 'view_expense_modal.component.html',
  styleUrls: ['view_expense_modal.component.less']
})
export class ViewExpenseModalComponent extends ListComponent {

  expenses: Expense[];
  attendances: Attendance[];
  _first_fortnight_expense: boolean = false;
  _second_fortnight_expense: boolean = false;
  _month: number = 0;
  _year: number = 0;
  _headquarter_id: number = 0;

  _title: string;
  @Input()
  set title(title) {
    this._title = title;
  }

  @Input()
  set first_fortnight_expense(first_fortnight_expense: boolean) {
    this._first_fortnight_expense = first_fortnight_expense;
  }

  @Input()
  set second_fortnight_expense(second_fortnight_expense: boolean) {
    this._second_fortnight_expense = second_fortnight_expense;
  }

  @Input()
  set month(month: number) {
    this._month = month;
  }

  @Input()
  set year(year: number) {
    this._year = year;
  }

  @Input()
  set headquarter_id(headquarter_id: number) {
    this._headquarter_id = headquarter_id;
    this.fetch();
  }

  /**
   * Send for approval
   *
   * @type {EventEmitter<any>}
   */
  @Output()
  managerExpenseStatusChanged = new EventEmitter();

  /**
   * Monthly Tour Program Constructor
   *
   * @param _service
   * @param expenseService
   */
  constructor(public _service: AuthService, public expenseService: ExpenseService) {
    super(_service);
  }

  /**
   *
   * @param date
   */
  formatDate(date) {
    return moment(date, 'YYYY-MM-DD').format('DD MMMM YYYY');
  }

  /**
   * Fetch Data
   */
  fetch() {
    this.loading = true;
    this.expenseService.all(this._month + 1, this._year, 0, 0, this._headquarter_id, this._first_fortnight_expense,
      this._second_fortnight_expense).subscribe(
      response => {
        this.expenses = response.expenses.map(function (expense) {
          return new Expense(expense);
        });

        this.attendances = response.attendances.map(att => new Attendance(att));
        this.prepareData();
        this.loading = false;
      },
      err => {
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

    this.expenseService.manager_approve(first_fortnight, second_fortnight, this._month + 1, this._year, this._headquarter_id).subscribe(
      response => {
        this.loading = false;
        this.fetch();
        this.managerExpenseStatusChanged.emit();
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
    this.expenseService.manager_approve(first_fortnight, second_fortnight, this._month + 1, this._year, this._headquarter_id).subscribe(
      response => {
        this.loading = false;
        this.fetch();
        this.managerExpenseStatusChanged.emit();
      },
      err => {
        this.loading = false;
      }
    );
  }

  /**
   * Total Daily Expense
   */
  get totalDailyExpense() {
    let total: number = 0;
    if (this.expenses && this.expenses.length > 0) {
      this.expenses.map(exp => {
        total += exp.daily_allowance;
      });
    }
    return total;
  }

  /**
   * Total Travel Expense
   */
  get totalTravelExpense() {
    let total: number = 0;
    if (this.expenses && this.expenses.length > 0) {
      this.expenses.map(exp => {
        total += exp.travel_allowance;
      });
    }
    return total;
  }

  /**
   * Total Travel Expense
   */
  get totalKMTravel() {
    let total: number = 0;
    if (this.expenses && this.expenses.length > 0) {
      this.expenses.map(exp => {
        total += exp.total_km_travelled;
      });
    }
    return total;
  }

  /**
   * Total Daily Expense
   */
  get totalExpense() {
    let total: number = 0;
    if (this.expenses && this.expenses.length > 0) {
      this.expenses.map(exp => {
        total += exp.daily_allowance + exp.travel_allowance + exp.daily_allowance_adjustment_amount;
      });
    }
    return total;
  }

  /**
   * Total Daily Expense
   */
  get totalDailyAdjustmentExpense() {
    let total: number = 0;
    if (this.expenses && this.expenses.length > 0) {
      this.expenses.map(exp => {
        total += exp.daily_allowance_adjustment_amount;
      });
    }
    return total;
  }
}
