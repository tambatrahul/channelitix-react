import {Directive, ElementRef} from "@angular/core";
import {Attendance} from "../models/attendance/attendance";


@Directive({
  selector: '[visitCount]',
  inputs: ['visit']
})
export class VisitCountDirective {

  leave: string = "#e74c3c";
  working: string = "#2ecc71";
  holiday: string = "#f1c40f";

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
  set visit(visit: number) {
    if (visit) {
      // set text value
      this.el.nativeElement.innerText = visit;

      // set background color depending on status
      if (visit < 5)
        this.el.nativeElement.style.backgroundColor = this.leave;
      else if (visit < 15)
        this.el.nativeElement.style.backgroundColor = this.holiday;
      else
        this.el.nativeElement.style.backgroundColor = this.working;
    }
  }
}
