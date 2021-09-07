import {Directive, ElementRef} from "@angular/core";
import {Visit} from "../models/visit/visit";
import {environment} from "../../environments/environment";
import {AppConstants} from "../app.constants";


@Directive({
    selector: '[mgVisitCount]',
    inputs: ['visit']
})
export class ManagerVisitCountDirective {

    environment = environment;

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
     * on change of count change background color or cell
     * @param visit
     */
    set visit(visit: Visit) {
        if (environment.envName != 'sk_group') {
            if (visit.visit_count >= 0 && visit.attendance.status == AppConstants.WORKING) {

                if (visit.visit_count == 0)
                    visit.visit_count = 0;

                // set text value
                this.el.nativeElement.innerText = visit.visit_count;

            }

            if (visit.isSunday) {
                this.el.nativeElement.innerText = 'H';
                this.el.nativeElement.style.backgroundColor = this.holiday;
            }
        } else {
            if (visit.visit_count >= 0 && visit.attendance.status == AppConstants.WORKING) {
                // set text value
                this.el.nativeElement.innerText = visit.visit_count;

            }

            if (visit.isSunday) {
                this.el.nativeElement.innerText = 'H';
                this.el.nativeElement.style.backgroundColor = this.holiday;
            }
        }

        if (visit.attendance.status) {
            if (visit.attendance.status != AppConstants.WORKING)
                this.el.nativeElement.innerText = visit.attendance.status.charAt(0).toUpperCase();
            else if (visit.attendance.status == AppConstants.WORKING && visit.attendance.work_type_id != 2 && visit.attendance.work_type_id != 10) {
                this.el.nativeElement.innerText = visit.attendance.work_type.name.charAt(0).toUpperCase();
            }

            // set background color depending on status
            if (visit.attendance.status == AppConstants.HOLIDAY)
                this.el.nativeElement.style.backgroundColor = this.holiday;
        }
    }
}
