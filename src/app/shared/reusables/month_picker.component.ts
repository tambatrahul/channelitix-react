import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from "@angular/core";
declare let jQuery: any;

@Component({
  selector: 'month-picker',
  templateUrl: 'templates/month_picker.component.html'
})
export class MonthPickerComponent {
  @Input()
  month: number;

  @Input()
  year: boolean;

  @Output()
  onMonthYearChanged = new EventEmitter();

  @ViewChild('month_year_input')
  month_year_input: ElementRef;

  /**
   * on load of component set Month Picker
   */
  ngOnInit() {
    let self = this;
    jQuery(self.month_year_input).datepicker();
  }

  /**
   * emit on change of value
   */
  onMonthYearChange(month, year) {
    this.onMonthYearChanged.emit({
      month: month,
      year: year
    });
  }
}
