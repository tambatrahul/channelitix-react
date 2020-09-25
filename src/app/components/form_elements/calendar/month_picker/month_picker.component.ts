import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from "@angular/core";
declare let jQuery: any;

@Component({
    selector: 'month-picker',
    templateUrl: 'month_picker.component.html'
})
export class MonthPickerComponent {
    @Input()
    month: number;

    @Input()
    year: number;

    @Output()
    onMonthYearChanged = new EventEmitter();

    @Input()
    title: string = 'Select Month & Year';

    @ViewChild('month_year_input')
    month_year_input: ElementRef;

    /**
     * on load of component set Month Picker
     */
    ngOnInit() {
        let self = this;

        // prepare start date
        let start_date = new Date(this.year, this.month, 1);

        // start date picker
        let picker = jQuery(this.month_year_input.nativeElement).datepicker({
            language: 'en',
            position: 'left center',
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
