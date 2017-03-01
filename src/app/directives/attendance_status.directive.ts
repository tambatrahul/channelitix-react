import {Directive, ElementRef} from "@angular/core";
import {Attendance} from "../models/attendance/attendance";


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
    if (att.status) {
      // set text value
      this.el.nativeElement.innerText = att.status.charAt(0).toUpperCase();

      // set background color depending on status
      if (att.status == 'leave')
        this.el.nativeElement.style.backgroundColor = this.leave;
      else if (att.status == 'working')
        this.el.nativeElement.style.backgroundColor = this.working;
      else if (att.status == 'holiday')
        this.el.nativeElement.style.backgroundColor = this.holiday;
    }
  }
}
