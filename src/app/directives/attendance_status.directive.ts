import {Directive, ElementRef} from "@angular/core";
import {Attendance} from "../models/attendance/attendance";
import {AppConstants} from "../app.constants";
import {environment} from "../../environments/environment";


@Directive({
    selector: '[attendanceStatus]',
    inputs: ['attendance']
})
export class AttendanceStatusDirective {

    environment = environment;

    leave: string = "#e74c3c";
    holiday: string = "#ecf0f1";

    below_15: string = "#f1c40f";
    above_15: string = "#2ecc71";

    below_20: string = "#f1c40f";
    below_30: string = "#FF9800";
    above_30: string = "#2ecc71";
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

        if (environment.envName != 'sk_group') {
            if (att.no_of_calls >= 0 && att.status == AppConstants.WORKING) {

                // set text value
                this.el.nativeElement.innerText = att.no_of_calls;

                // set background color depending on status
                if (att.no_of_calls < 20)
                    this.el.nativeElement.style.backgroundColor = this.below_20;
                else if (att.no_of_calls < 30)
                    this.el.nativeElement.style.backgroundColor = this.below_30;
                else
                    this.el.nativeElement.style.backgroundColor = this.above_30;
            }

            if (att.isSunday) {
                this.el.nativeElement.innerText = 'H';
                this.el.nativeElement.style.backgroundColor = this.holiday;
            }
        } else {
            if (att.no_of_calls >= 0 && att.status == AppConstants.WORKING) {
                // set text value
                this.el.nativeElement.innerText = att.no_of_calls;

                // set background color depending on status
                if (att.no_of_calls < 15)
                    this.el.nativeElement.style.backgroundColor = this.below_15;
                else
                    this.el.nativeElement.style.backgroundColor = this.above_15;
            }

            if (att.isSunday) {
                this.el.nativeElement.innerText = 'H';
                this.el.nativeElement.style.backgroundColor = this.holiday;
            }
        }

        if (att.status) {
            if (att.status != AppConstants.WORKING)
                this.el.nativeElement.innerText = att.status.charAt(0).toUpperCase();

            // set background color depending on status
            if (att.status == AppConstants.LEAVE)
                this.el.nativeElement.style.backgroundColor = this.leave;
            else if (att.status == AppConstants.HOLIDAY)
                this.el.nativeElement.style.backgroundColor = this.holiday;
        }
    }
}
