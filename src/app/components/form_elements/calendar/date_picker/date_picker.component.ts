import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from "@angular/core";
declare let jQuery: any;

@Component({
    selector: 'date-picker',
    templateUrl: 'date_picker.component.html'
})
export class DatePickerComponent {

    /**
     * Date input
     */
    @Input()
    get date() {
        return this._date;
    }

    set date(date) {
        this._date = date;
        if (this.picker && this._date.length > 0)
            this.picker.selectDate(new Date(this._date));
    }

    /**
     * date value
     */
    _date: string = "";

    /**
     * Title of field
     */
    @Input()
    title: string;

    /**
     * date_format for input
     * @type {string}
     */
    @Input()
    date_format: string = 'dd MM yyyy';

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
     * date picker instance
     */
    picker;

    /**
     * on load of component set Month Picker
     */
    ngOnInit() {
        let self = this;

        // start date picker
        this.picker = jQuery(this.date_input.nativeElement).datepicker({
            language: 'en',
            position: 'left center',
            dateFormat: this.date_format,
            onSelect: function (fd, d, picker) {
                self.onDateChanged.emit(fd);
            }
        }).data('datepicker');

        this.picker.selectDate(new Date(this._date));
    }
}
