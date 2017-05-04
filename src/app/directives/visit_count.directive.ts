import {Directive, ElementRef} from "@angular/core";
import {Attendance} from "../models/attendance/attendance";
import {Visit} from "../models/visit/visit";


@Directive({
  selector: '[visitCount]',
  inputs: ['visit']
})
export class VisitCountDirective {

  below_20: string = "#e74c3c";
  below_30: string = "#f1c40f";
  above_30: string = "#2ecc71";
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
    if (visit.visit_count > 0) {
      // set text value
      this.el.nativeElement.innerText = visit.visit_count;

      // set background color depending on status
      if (visit.visit_count < 20)
        this.el.nativeElement.style.backgroundColor = this.below_20;
      else if (visit.visit_count < 30)
        this.el.nativeElement.style.backgroundColor = this.below_30;
      else
        this.el.nativeElement.style.backgroundColor = this.above_30;
    }

    if (visit.isSunday) {
      this.el.nativeElement.innerText = 'H';
      this.el.nativeElement.style.backgroundColor = this.holiday;
    }
  }
}
