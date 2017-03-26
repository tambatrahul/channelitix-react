import {Directive, ElementRef} from "@angular/core";
import {Attendance} from "../models/attendance/attendance";
import {AppConstants} from "../app.constants";


@Directive({
    selector: '[attendanceStatus]',
    inputs: ['attendance']
})
export class AttendanceStatusDirective {

    leave: string = "#e74c3c";
    working: string = "#2ecc71";
    holiday: string = "#ecf0f1";

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

        if (att.isSunday) {
            this.el.nativeElement.innerText = 'S';
            this.el.nativeElement.style.backgroundColor = this.holiday;
        }

        if (att.status) {
            // set text value
            this.el.nativeElement.innerText = att.status.charAt(0).toUpperCase();

            // set background color depending on status
            if (att.status == AppConstants.LEAVE)
                this.el.nativeElement.style.backgroundColor = this.leave;
            else if (att.status == AppConstants.WORKING)
                this.el.nativeElement.style.backgroundColor = this.working;
            else if (att.status == AppConstants.HOLIDAY)
                this.el.nativeElement.style.backgroundColor = this.holiday;
        }

        if (att.isHoliday) {
            this.el.nativeElement.innerText = 'H';
            this.el.nativeElement.style.backgroundColor = this.holiday;
        }

        if (att.isDisabled)
            this.el.nativeElement.style.backgroundColor = this.holiday;
    }
}
