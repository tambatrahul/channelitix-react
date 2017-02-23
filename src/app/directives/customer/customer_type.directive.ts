import {Directive, ElementRef} from "@angular/core";
import {CustomerType} from "../../models/customer/customer_type";


@Directive({
  selector: '[customerType]',
  inputs: ['customer_type']
})
export class CustomerTypeDirective {

  stockist: string = "stockist";
  semi: string = "semi";
  hub: string = "hub";
  retailer: string = "retailer";

  stockist_icon = 'fa fa-group';
  semi_icon = 'fa fa-group';
  hub_icon = 'fa fa-shopping-cart';
  retailer_icon = 'fa fa-shopping-cart';

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
   * @param ct
   */
  set customer_type(ct: CustomerType) {
    if (ct.id) {
      // set background color depending on status

      let cl = this.stockist;
      let icon = this.retailer_icon;
      if (ct.id == 1) {
        cl = this.stockist;
        icon = this.stockist_icon;
      } else if (ct.id == 2) {
        cl = this.semi;
        icon = this.semi_icon;
      } else if (ct.id == 3) {
        cl = this.hub;
        icon = this.hub_icon;
      } else if (ct.id == 4) {
        cl = this.retailer;
        icon = this.retailer_icon;
      }

      jQuery(this.el.nativeElement).addClass(cl);

      let stat = jQuery(this.el.nativeElement).find('.stats-icon i');
      stat.addClass(icon);
    }
  }
}
