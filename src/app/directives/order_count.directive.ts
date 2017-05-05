import {Directive, ElementRef} from "@angular/core";
import {Order} from "../models/order/order";


@Directive({
  selector: '[orderCount]',
  inputs: ['order']
})
export class OrderCountDirective {

  below_500: string = "#e74c3c";
  below_2500: string = "#f1c40f";
  above_2500: string = "#2ecc71";
  holiday: string = "#ecf0f1";

  /**
   * Order Status Directive
   *
   * @param el
   */
  constructor(private el: ElementRef) {
    this.el = el;
  }

  /**
   * on change of count change background color or cell
   * @param order
   */
  set order(order: Order) {
    if (order.order_total_count > 0) {
      // set text value
      this.el.nativeElement.innerText = (order.order_total_count/1000).toFixed(1);

      // set background color depending on status
      if (order.order_total_count < 500)
        this.el.nativeElement.style.backgroundColor = this.below_500;
      else if (order.order_total_count < 2500)
        this.el.nativeElement.style.backgroundColor = this.below_2500;
      else
        this.el.nativeElement.style.backgroundColor = this.above_2500;
    }

    if (order.isSunday) {
      this.el.nativeElement.innerText = 'H';
      this.el.nativeElement.style.backgroundColor = this.holiday;
    }
  }
}
