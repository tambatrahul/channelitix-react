import {Directive, ElementRef} from "@angular/core";
import {Attendance} from "../models/attendance/attendance";
import {Visit} from "../models/visit/visit";


@Directive({
  selector: '[visitCount]',
  inputs: ['visit']
})
export class VisitCountDirective {

  below_5: string = "#e74c3c";
  below_15: string = "#f1c40f";
  above_15: string = "#2ecc71";
  holiday: string = "#95a5a6";

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
      if (visit.visit_count < 5)
        this.el.nativeElement.style.backgroundColor = this.below_5;
      else if (visit.visit_count < 15)
        this.el.nativeElement.style.backgroundColor = this.below_15;
      else
        this.el.nativeElement.style.backgroundColor = this.above_15;
    }

    if (visit.isSunday) {
      this.el.nativeElement.innerText = 'H';
      this.el.nativeElement.style.backgroundColor = this.holiday;
    }
  }
}
