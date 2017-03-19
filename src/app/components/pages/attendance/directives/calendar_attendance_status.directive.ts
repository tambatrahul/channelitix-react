import {Directive, ElementRef, ViewChild} from "@angular/core";
import {Attendance} from "../../../../models/attendance/attendance";
import {AppConstants} from "../../../../app.constants";


@Directive({
    selector: '[calendarAttendanceStatus]',
    inputs: ['attendance']
})
export class CalendarAttendanceStatusDirective {

    leave: string = "#e74c3c";
    working: string = "#2ecc71";
    holiday: string = "#bdc3c7";
    nothing: string = "#ecf0f1";
    not_marked: string = "#e67e22";

    /**
     * Attendance Status Directive
     *
     * @param el
     */
    constructor(private el: ElementRef) {
        this.el = el;
    }

    /**
     * on change of status change background color or cell
     * @param att
     */
    set attendance(att: Attendance) {
        if (att) {
            this.el.nativeElement.style.backgroundColor = this.not_marked;
        }

        if (att && att.isSunday) {
            this.el.nativeElement.style.backgroundColor = this.holiday;
        }

        if (att && att.status) {

            // set background color depending on status
            if (att.status == AppConstants.LEAVE)
                this.el.nativeElement.style.backgroundColor = this.leave;
            else if (att.status == AppConstants.WORKING)
                this.el.nativeElement.style.backgroundColor = this.working;
            else if (att.status == AppConstants.HOLIDAY)
                this.el.nativeElement.style.backgroundColor = this.holiday;
        }

        if (att && att.isHoliday) {
            this.el.nativeElement.style.backgroundColor = this.holiday;
        }
    }
}
