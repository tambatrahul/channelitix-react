import {Directive, ElementRef} from "@angular/core";
import {Order} from "../models/order/order";
import {AppConstants} from "../app.constants";


@Directive({
    selector: '[orderCount]',
    inputs: ['order', 'target']
})
export class OrderCountDirective {

    below_500: string = "#f1c40f";
    above_2500: string = "#2ecc71";
    holiday: string = "#ecf0f1";
    leave: string = "#e74c3c";

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
     * format cell for targets
     */
    formatCell() {
        if (this._order.order_total_count >= 0 && this._order.attendance.status == AppConstants.WORKING) {

            // set text value
            this.el.nativeElement.innerText = (this._order.order_total_count / 1000).toFixed(1);

            // set background color depending on status
            if (this._order.order_total_count < this._target)
                this.el.nativeElement.style.backgroundColor = this.below_500;
            else
                this.el.nativeElement.style.backgroundColor = this.above_2500;
        }

        if (this._order.isSunday) {
            this.el.nativeElement.innerText = 'H';
            this.el.nativeElement.style.backgroundColor = this.holiday;
        }

        if (this._order.attendance.status) {
            if (this._order.attendance.status != AppConstants.WORKING)
                this.el.nativeElement.innerText = this._order.attendance.status.charAt(0).toUpperCase();

            // set background color depending on status
            if (this._order.attendance.status == AppConstants.LEAVE)
                this.el.nativeElement.style.backgroundColor = this.leave;
            else if (this._order.attendance.status == AppConstants.HOLIDAY)
                this.el.nativeElement.style.backgroundColor = this.holiday;
        }
    }
}
