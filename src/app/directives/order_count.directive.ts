import {Directive, ElementRef} from "@angular/core";
import {Order} from "../models/order/order";
import {AppConstants} from "../app.constants";


@Directive({
  selector: '[orderCount]',
  inputs: ['order', 'target', 'toggleFlag']
})
export class OrderCountDirective {

  below_500: string = "#f1c40f";
  above_2500: string = "#2ecc71";
  holiday: string = "#ecf0f1";
  leave: string = "#e74c3c";
  highLight: string = "#fff";
  below_250: string = "#f1c40f";
  above_250: string = "#2ecc71";

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
  _order: Order;
  set order(order: Order) {
    this._order = order;
    this.formatCell();
  }

  /**
   * view quantity
   *
   * @type {number}
   * @private
   */
  _toggleFlag: string = 'rupes';
  set toggleFlag(toggleFlag) {
    this._toggleFlag = toggleFlag;
    this.formatCell();
  }

  /**
   * format cell for targets
   */
  formatCell() {
    if (this._order) {
      if (this._order.order_total_count >= 0 && this._order.attendance.status == AppConstants.WORKING) {
        //
        // if (this._order.order_total_count == 0 && this._order.attendance.pob_amount > 0)
        //   this._order.order_total_count = this._order.attendance.pob_amount;

        // set text value
        if (this._toggleFlag == 'rupes')
          this.el.nativeElement.innerText = (this._order.order_total_count / 1000).toFixed(1);
        if (this._toggleFlag == 'quantity')
          this.el.nativeElement.innerText = parseFloat(String(this._order.order_total_quantity)).toFixed(0);
        if (this._toggleFlag == 'order')
          this.el.nativeElement.innerText = this._order.distinct_order_count;

        // set text value
        // if (this._view_quantity)
        //   this.el.nativeElement.innerText = parseFloat(String(this._order.order_total_quantity)).toFixed(0);
        // else
        //   this.el.nativeElement.innerText = (this._order.order_total_count / 1000).toFixed(1);

        // set background color depending on status
        if (this._order.attendance.status == AppConstants.WORKING && this._order.attendance.work_type_id == 2 || this._order.attendance.work_type_id == 10) {
          if (this._toggleFlag == 'rupes' || this._toggleFlag == 'quantity' || this._toggleFlag == 'order') {
            if (this._order.order_total_count == 0) {
              this.el.nativeElement.style.backgroundColor = this.leave;
              this.el.nativeElement.style.color = this.highLight;
            }
            else
            if ((this._order.order_total_count / 1000) < (this._target))
              this.el.nativeElement.style.backgroundColor = this.below_500;
            else
              this.el.nativeElement.style.backgroundColor = this.above_2500;
          } else {
            if (this._order.order_total_quantity == 0) {
              this.el.nativeElement.style.backgroundColor = this.leave;
              this.el.nativeElement.style.color = this.highLight;
            }
          else
              this.el.nativeElement.style.backgroundColor = this.above_250;
          }


        }
      }

      if (this._order.isSunday) {
        this.el.nativeElement.innerText = 'H';
        this.el.nativeElement.style.backgroundColor = this.holiday;
      }

      if (this._order.attendance.status) {
        if (this._order.attendance.status != AppConstants.WORKING)
          this.el.nativeElement.innerText = this._order.attendance.status.charAt(0).toUpperCase();
        else if (this._order.attendance.status == AppConstants.WORKING && this._order.attendance.work_type_id != 2 && this._order.attendance.work_type_id != 10)
          this.el.nativeElement.innerText = this._order.attendance.work_type.name.charAt(0).toUpperCase();

        // set background color depending on status
        if (this._order.attendance.status == AppConstants.LEAVE)
          this.el.nativeElement.style.color = this.leave;
        if (this._order.attendance.status == AppConstants.HOLIDAY)
          this.el.nativeElement.style.backgroundColor = this.holiday;
      }
    }
  }
}
