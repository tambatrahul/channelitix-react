import {Directive, ElementRef} from "@angular/core";
import {Visit} from "../models/visit/visit";
import {environment} from "../../environments/environment";
import {AppConstants} from "../app.constants";


@Directive({
  selector: '[visitCount]',
  inputs: ['visit']
})
export class VisitCountDirective {

  environment = environment;

  leave: string = "#FF9800";
  holiday: string = "#ecf0f1";

  below_10: string = "#FF9800";
  above_10: string = "#f1c40f";

  below_20: string = "#f1c40f";
  above_20: string = "#2ecc71";

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

        // set background color depending on status
        if (visit.visit_count < 10)
          this.el.nativeElement.style.backgroundColor = this.below_10;
        else if (visit.visit_count < 20)
          this.el.nativeElement.style.backgroundColor = this.above_10;
        else
          this.el.nativeElement.style.backgroundColor = this.above_20;
      }

      if (visit.isSunday) {
        this.el.nativeElement.innerText = 'H';
        this.el.nativeElement.style.backgroundColor = this.holiday;
      }
    } else {
      if (visit.visit_count >= 0 && visit.attendance.status == AppConstants.WORKING) {
        // set text value
        this.el.nativeElement.innerText = visit.visit_count;

        // set background color depending on status
        if (visit.visit_count < 10)
          this.el.nativeElement.style.backgroundColor = this.below_10;
        else
          this.el.nativeElement.style.backgroundColor = this.above_10;
      }

      if (visit.isSunday) {
        this.el.nativeElement.innerText = 'H';
        this.el.nativeElement.style.backgroundColor = this.holiday;
      }
    }

    if (visit.attendance.status) {
      if (visit.attendance.status != AppConstants.WORKING)
        this.el.nativeElement.innerText = visit.attendance.status.charAt(0).toUpperCase();
      else if (visit.attendance.status == AppConstants.WORKING && visit.attendance.work_type_id != 2 && visit.attendance.work_type_id != 10 ) {
        this.el.nativeElement.innerText = visit.attendance.work_type.name.charAt(0).toUpperCase();
      }

      // set background color depending on status
      if (visit.attendance.status == AppConstants.LEAVE)
        this.el.nativeElement.style.backgroundColor = this.leave;
      else if (visit.attendance.status == AppConstants.MEETING)
        this.el.nativeElement.style.backgroundColor = this.leave;
      else if (visit.attendance.status == AppConstants.HOLIDAY)
        this.el.nativeElement.style.backgroundColor = this.holiday;
    }
  }
}
