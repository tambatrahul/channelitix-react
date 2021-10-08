import {Directive, ElementRef} from "@angular/core";
import {Attendance} from "../../../../models/attendance/attendance";
import {AppConstants} from "../../../../app.constants";


@Directive({
    selector: '[calendarAttendanceStatus]',
    inputs: ['attendance']
})
export class CalendarAttendanceStatusDirective {

    leave: string = "#e74c3c";
    pending_leave: string = "#FF0000";
    working: string = "#2ecc71";
    holiday: string = "#bdc3c7";
    nothing: string = "#ecf0f1";
    not_marked: string = "#e67e22";
    reporting_status: string = "#f1c40f";

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

        // mark sunday
        if (att && att.isSunday)
            this.el.nativeElement.style.backgroundColor = this.holiday;

        if (att && att.status && att.reporting_status == 'closed') {

            // set background color depending on status
            if (att.status == AppConstants.LEAVE && att.approved_status == 'approved')
                this.el.nativeElement.style.backgroundColor = this.leave;
            else if (att.status == AppConstants.LEAVE && att.approved_status == 'pending')
                this.el.nativeElement.style.backgroundColor = this.pending_leave;
            else if (att.status == AppConstants.WORKING)
                this.el.nativeElement.style.backgroundColor = this.working;
            else if (att.status == AppConstants.HOLIDAY)
                this.el.nativeElement.style.backgroundColor = this.holiday;
        } else if (att && att.status && att.status == AppConstants.WORKING && att.reporting_status == AppConstants.OPEN)
            this.el.nativeElement.style.backgroundColor = this.reporting_status;


        // mark holiday
        if (att && att.isHoliday)
            this.el.nativeElement.style.backgroundColor = this.holiday;

        // mark disabled
        if (att && att.isDisabled)
            this.el.nativeElement.style.backgroundColor = this.holiday;
    }
}
