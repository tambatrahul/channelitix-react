import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Expense} from '../../../../../models/expense/expense';
import {ListComponent} from '../../../../base/list.component';
import {AuthService} from '../../../../../services/AuthService';
import {ExpenseService} from '../../../../../services/expense.service';

declare let jQuery: any;

@Component({
  selector: 'second-fortnight-expense',
  templateUrl: 'second_fortnight_expense.component.html',
  styleUrls: ['second_fortnight_expense.component.less']
})
export class SecondFortnightComponent extends ListComponent {

  hq_headquarter_id: number = 0;
  btn_loading: boolean = false;

  _second_fortnight_expenses: Expense[];
  @Input()
  set second_fortnight_expenses(second_fortnight_expenses: Expense[]) {
    this._second_fortnight_expenses = second_fortnight_expenses;
  }

  _month: number = 0;
  @Input()
  set month(month: number) {
    this._month = month;
  }

  _year: number = 0;
  @Input()
  set year(year: number) {
    this._year = year;
  }

  _hq_region_id: number = 0;
  @Input()
  set hq_region_id(hq_region_id: number) {
    this._hq_region_id = hq_region_id;
  }

  _hq_area_id: number = 0;
  @Input()
  set hq_area_id(hq_area_id: number) {
    this._hq_area_id = hq_area_id;
  }

  /**
   * loading identifier
   */
  @ViewChild('second_fortnight_modal')
  second_fortnight_modal: ElementRef;

  /**
   * Manager  Status Changed
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
  constructor(public _service: AuthService,
              public expenseService: ExpenseService) {
    super(_service);
  }


  /**
   * Send for approval
   */
  open_second_fortnight_modal(hq_headquarter_id) {
    this.hq_headquarter_id = hq_headquarter_id;
    jQuery(this.second_fortnight_modal.nativeElement).modal();
  }

  fetch() {
  }

  /**
   * Manager Expense Status Changed
   */
  managerStatusChanged() {
    this.managerExpenseStatusChanged.emit();
  }

  /**
   * Download Excel For Stockist POB
   */
  download() {
    this.btn_loading = true;

    this.expenseService.expense_excel_download(this._month + 1, this._year,
      'second_fortnight', this._hq_region_id, this._hq_area_id).subscribe(
      response => {
        let blob: Blob = response.blob();

        // Doing it this way allows you to name the file
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'second_fortnight_expense_report.xls';
        link.click();
        this.btn_loading = false;

      },
      err => {
        this.btn_loading = false;
      }
    );
  }
}
