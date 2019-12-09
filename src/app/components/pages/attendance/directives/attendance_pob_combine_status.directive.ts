import {Directive, ElementRef} from "@angular/core";
import {isUndefined} from "util";
import {AppConstants} from "../../../../app.constants";
import {Attendance} from "../../../../models/attendance/attendance";
import {Order} from "../../../../models/order/order";


@Directive({
    selector: '[attendancePobCombineStatus]',
    inputs: ['attendance', 'target']
})
export class AttendancePobCombineStatusDirective {

    below_500: string = "#f1c40f";
    above_2500: string = "#2ecc71";
    holiday: string = "#ecf0f1";
    leave: string = "#e74c3c";

    /**
     * Order Status Directive
     *
     * @param el
     */
    constructor(private el: ElementRef) {
        this.el = el;
    }

    /**
     * target
     *
     * @type {number}
     * @private
     */
    _target: number = 0;
    set target(target) {
        this._target = target;
        this.formatCell();
    }

    /**
     * on change of count change background color or cell
     * @param order
     */
    _att: Attendance;
    set attendance(att: Attendance) {
        this._att = att;
        this.formatCell();
    }

    /**
     * format cell for targets
     */
    formatCell() {
        if (this._att.pob_amount_combine >= 0 && this._att.status == AppConstants.WORKING) {

            // set text value
            this.el.nativeElement.innerText = (this._att.pob_amount_combine / 1000).toFixed(1);

            // set background color depending on status
            if ((this._att.pob_amount_combine/1000) < this._target)
                this.el.nativeElement.style.backgroundColor = this.below_500;
            else
                this.el.nativeElement.style.backgroundColor = this.above_2500;
        }

        if (this._att.isSunday) {
            this.el.nativeElement.innerText = 'H';
            this.el.nativeElement.style.backgroundColor = this.holiday;
        }

        if (this._att.status) {
            if (this._att.status != AppConstants.WORKING)
                this.el.nativeElement.innerText = this._att.status.charAt(0).toUpperCase();

            // set background color depending on status
            if (this._att.status == AppConstants.LEAVE)
                this.el.nativeElement.style.backgroundColor = this.leave;
            else if (this._att.status == AppConstants.HOLIDAY)
                this.el.nativeElement.style.backgroundColor = this.holiday;
        }
    }
}
