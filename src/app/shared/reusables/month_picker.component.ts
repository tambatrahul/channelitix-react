import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from "@angular/core";
declare let jQuery: any;
import * as moment from "moment";

@Component({
  selector: 'month-picker',
  templateUrl: 'templates/month_picker.component.html'
})
export class MonthPickerComponent {
  @Input()
  month: number;

  @Input()
  year: number;

  @Output()
  onMonthYearChanged = new EventEmitter();

  @ViewChild('month_year_input')
  month_year_input: ElementRef;

  /**
   * on load of component set Month Picker
   */
  ngOnInit() {
    let self = this;

    // prepare start date
    let start_date = new Date(this.year, this.month, 1);
    console.log(start_date);

    // start datepicker
    let picker = jQuery(this.month_year_input.nativeElement).datepicker({
      language: 'en',
      onSelect: function (fd, d, picker) {
        self.onMonthYearChanged.emit({
          month: d.getMonth(),
          year: d.getFullYear()
        });
      }
    }).data('datepicker');

    picker.selectDate(start_date)
  }
}
