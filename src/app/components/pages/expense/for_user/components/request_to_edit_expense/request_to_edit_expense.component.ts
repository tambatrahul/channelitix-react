import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ListComponent} from '../../../../../base/list.component';
import {AuthService} from '../../../../../../services/AuthService';
import {ExpenseService} from '../../../../../../services/expense.service';
import * as moment from 'moment';

@Component({
  selector: 'app-request-to-edit-expense',
  templateUrl: 'request_to_edit_expense.component.html',
  styleUrls: ['request_to_edit_expense.component.less']
})
export class RequestToEditExpenseComponent extends ListComponent {

  _first_fortnight_expense: boolean = false;
  _second_fortnight_expense: boolean = false;
  _month: number = 0;
  _year: number = 0;
  comments: string;

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

  /**
   * Send for approval
   *
   * @type {EventEmitter<any>}
   */
  @Output()
  expenseEditRequestSend = new EventEmitter();

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
   * Fetch Data
   */
  fetch() {

  }

  /**
   * Request To Edit Expense
   */
  requestToEditExpense() {
    this.loading = true;
    if (this.comments) {
      this.expenseService.request_to_edit_expense(this._title, this._first_fortnight_expense, this._second_fortnight_expense,
        this._month + 1, this._year, this.comments).subscribe(
        response => {
          this.loading = false;
          this.expenseEditRequestSend.emit();
        },
        err => {
          this.loading = false;
        }
      );
    }
  }
}
