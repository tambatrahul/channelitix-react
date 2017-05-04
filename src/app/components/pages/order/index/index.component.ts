import {Component} from "@angular/core";
import * as moment from "moment";
import {User} from "../../../../models/user/user";
import {AppConstants} from "../../../../app.constants";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {AuthService} from "../../../../services/AuthService";
import {Holiday} from "../../../../models/holiday";
import {OrderService} from "../../../../services/order.service";
import {Order} from "../../../../models/order/order";
declare let jQuery: any;

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class OrderComponent extends BaseAuthComponent {

    /**
     * manager and user Role id
     * @type {number}
     */
    public role_id: number = 0;
    public manager_role_id: number = 0;

    /**
     * manager_id
     */
    public manager_id: number = 0;

    /**
     * year and month for calendar
     * @type {number}
     */
    public month: number;
    public year: number;

    /**
     * get date range
     *
     * @returns {Array<number>}
     */
    get dates(): Array<number> {
        let dates = [];
        for (let d = 1; d <= moment().month(this.month).year(this.year).endOf('month').date(); d++) {
            dates.push(d);
        }
        return dates;
    }

    /**
     * get title of table
     * @returns {string}
     */
    get title(): string {
        return moment().year(this.year).month(this.month).format("MMMM, YYYY");
    }

    /**
     * users
     *
     * @type {{}}
     */
    public users: User[] = [];

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
        this.month = moment().month();
        this.year = moment().year();
        this.fetchOrders();
    }

    /**
     * Adding Orders to skeleton
     *
     * @param users
     * @param orders
     * @param holidays
     */
    addOrderToSkeleton(users: User[], orders: Order[], holidays: Holiday[]) {
        let data_skeleton = {};

        let skeleton = AppConstants.prepareMonthOrderSkeleton(this.month, this.year, holidays);

        // prepare order skeleton
        for (let order of orders) {

            // add user if not present
            if (!data_skeleton.hasOwnProperty(order.created_by)) {
                data_skeleton[order.created_by] = skeleton.map(order => Object.assign({}, order));
                users.push(order.creator);
            }

            // set order details
            data_skeleton[order.created_by][order.order_day - 1].order_total_count = order.order_total_count;
        }

        // add skeleton to user
        for (let user of users) {
            user.orders = data_skeleton[user.id];
        }

        this.users = users;
    }

    /**
     * load attendance for children of logged in user
     */
    fetchOrders() {
        this.loading = true;
        this.orderService.monthlyCountForChildren(this.month + 1, this.year, this.role_id, this.manager_id).subscribe(
            response => {
                this.loading = false;

                // convert to models
                let children = response.children.map(function (user, index) {
                    return new User(user);
                });

                this.addOrderToSkeleton(children, response.orders, response.holidays);
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * month and year changed
     *
     * @param date
     */
    monthYearChanged(date) {
        this.month = date.month;
        this.year = date.year;
        this.fetchOrders();
    }

    /**
     * when role is changed filter list of orders
     * @param role_id
     */
    roleChanged(role_id) {
        this.role_id = role_id;
        this.manager_role_id = parseInt(role_id) + 1;
        this.managerChanged(0);
    }

    /**
     * when role is changed filter list of users
     *
     * @param manager_id
     */
    managerChanged(manager_id) {
        this.manager_id = manager_id;
        this.fetchOrders();
    }
}
