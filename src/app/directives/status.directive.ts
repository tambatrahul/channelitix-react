import {Directive, ElementRef} from "@angular/core";


@Directive({
  selector: '[status]',
  inputs: ['field']
})
export class StatusDirective {

  active: string = "fa fa-check-circle";
  in_active: string = "fa fa-times-circle";

  active_color: string = "#2ecc71";
  in_active_color: string = "#e74c3c";

  /**
   * Customer Status Directive
   *
   * @param el
   */
  constructor(private el: ElementRef) {
    this.el = el;
  }

  /**
   * on change of status change icon
   *
   * @param status
   */
  set field(status: string) {
    if (status) {
      // initial status
      let st = this.active;
      let color = this.active_color;

      // set background color depending on status
      if (status == 'active') {
        st = this.active;
        color = this.active_color;
      } else if (status == 'in_active') {
        st = this.in_active;
        color = this.in_active_color;
      }

      // set color and icon for status
      jQuery(this.el.nativeElement).addClass(st);
      this.el.nativeElement.style.color = color;
    }
  }
}
