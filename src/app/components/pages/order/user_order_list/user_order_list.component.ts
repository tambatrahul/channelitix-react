import {Component, Input} from "@angular/core";
import * as moment from "moment";
import {User} from "../../../../models/user/user";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {AuthService} from "../../../../services/AuthService";
import {OrderService} from "../../../../services/order.service";
import {Order} from "../../../../models/order/order";
declare let jQuery: any;

@Component({
    selector: 'user-order-list',
    templateUrl: 'user_order_list.component.html',
    styleUrls: ['user_order_list.component.less']
})
export class UserOrderListComponent extends BaseAuthComponent {

    /**
     * selected order id
     */
    selectedOrderId: number;

    _user: User;
    @Input()
    set user(user) {
        this._user = user;
        this.fetch();
    }

    /**
     * month for report
     */
    @Input()
    month: number;

    /**
     * year for report
     */
    @Input()
    year: number;

    /**
     * date for report
     */
    _date: number;
    @Input()
    set date(date: number) {
        this._date = date;
        this.fetch();
    }

    /**
     * get title of table
     * @returns {string}
     */
    get title(): string {
        return this._date + " " + moment().year(this.year).month(this.month).format("MMMM, YYYY") + " for " + this._user.full_name;
    }

    /**
     * users
     *
     * @type {{}}
     */
    public orders: Order[] = [];

    /**
     * User Component Constructor
     *
     */
    constructor(private orderService: OrderService, public _service: AuthService) {
        super(_service);
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        super.ngOnInit();
    }

    /**
     * fetch server data for visits
     */
    fetch() {
        if (this.month && this.year && this._user && this._date) {
            this.loading = true;
            this.orderService.forUser(this._user.id, this.month + 1, this.year, this._date).subscribe(
                response => {
                    this.orders = response.orders.map(order => new Order(order));
                    if (this._service.user.username == 'abbottadmin')
                        this.orders = this.orders.filter(order => {
                            if (order.isSynergy) {
                                return true;
                            }
                            return false;
                        });
                    this.loading = false;
                },
                err => {
                    this.loading = false;
                }
            )
        }
    }

    /**
     * select order
     *
     * @param order_id
     */
    selectOrder(order_id: number) {
        this.selectedOrderId = order_id;
    }
}
