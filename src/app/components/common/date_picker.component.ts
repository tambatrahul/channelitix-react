import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from "@angular/core";
declare let jQuery: any;

@Component({
  selector: 'date-picker',
  templateUrl: '../../templates/common/date_picker.component.html'
})
export class DatePickerComponent {

  /**
   * Date input
   */
  @Input()
  date: number;

  /**
   * Title of field
   */
  @Input()
  title:string;

  /**
   * Date changed emitter
   */
  @Output()
  onDateChanged = new EventEmitter();

  /**
   * date input field
   */
  @ViewChild('date_input')
  date_input: ElementRef;

  /**
   * on load of component set Month Picker
   */
  ngOnInit() {
    let self = this;

    // start date picker
    let picker = jQuery(this.date_input.nativeElement).datepicker({
      language: 'en',
      onSelect: function (fd, d, picker) {
        self.onDateChanged.emit(d);
      }
    }).data('datepicker');

    picker.selectDate(this.date);
  }
}
