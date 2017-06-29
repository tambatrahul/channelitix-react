import {Directive, ElementRef} from "@angular/core";
import {Order} from "../models/order/order";
import {AppConstants} from "../app.constants";


@Directive({
    selector: '[mgOrderCount]',
    inputs: ['order', 'target', 'view_quantity']
})
export class ManagerOrderCountDirective {

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
    _view_quantity: boolean = false;
    set view_quantity(view_quantity) {
        this._view_quantity = view_quantity;
        this.formatCell();
    }

    /**
     * format cell for targets
     */
    formatCell() {
        if (this._order) {
            if (this._order.order_total_count >= 0 && this._order.attendance.status == AppConstants.WORKING) {

                if (this._order.order_total_count == 0 && this._order.attendance.pob_amount > 0)
                    this._order.order_total_count = this._order.attendance.pob_amount;

                // set text value
                if (this._view_quantity)
                    this.el.nativeElement.innerText = parseFloat(String(this._order.order_total_quantity)).toFixed(0);
                else
                    this.el.nativeElement.innerText = (this._order.order_total_count / 1000).toFixed(1);
            // set text value
            if(this._view_quantity)
                this.el.nativeElement.innerText = parseFloat(String(this._order.order_total_quantity)).toFixed(0);
            else
                this.el.nativeElement.innerText = (this._order.order_total_count / 1000).toFixed(1);

            }

            if (this._order.isSunday) {
                this.el.nativeElement.innerText = 'H';
                this.el.nativeElement.style.backgroundColor = this.holiday;
            }

            if (this._order.attendance.status) {
                if (this._order.attendance.status != AppConstants.WORKING)
                    this.el.nativeElement.innerText = this._order.attendance.status.charAt(0).toUpperCase();

                // set background color depending on status
                if (this._order.attendance.status == AppConstants.HOLIDAY)
                    this.el.nativeElement.style.backgroundColor = this.holiday;
            }
        }
    }
}
