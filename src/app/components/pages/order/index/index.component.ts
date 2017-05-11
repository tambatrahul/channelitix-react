import {Component} from "@angular/core";
import * as moment from "moment";
import {User} from "../../../../models/user/user";
import {AppConstants} from "../../../../app.constants";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {AuthService} from "../../../../services/AuthService";
import {Holiday} from "../../../../models/holiday";
import {OrderService} from "../../../../services/order.service";
import {Order} from "../../../../models/order/order";
import {Observable} from "rxjs/Rx";
import {AttendanceService} from "../../../../services/attendance.service";
import {Attendance} from "../../../../models/attendance/attendance";
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
     * users
     *
     * @type {{}}
     */
    public managers: User[] = [];

    /**
     * User Component Constructor
     *
     */
    constructor(private orderService: OrderService, private attendanceService: AttendanceService,
                public _service: AuthService) {
        super(_service);
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        super.ngOnInit();
        this.month = moment().month();
        this.year = moment().year();
        this.fetchData();
    }

    /**
     * Adding Orders to skeleton
     *
     * @param users
     * @param orders
     * @param holidays
     * @param attendances
     */
    addOrderToSkeleton(users: User[], orders: Order[], holidays: Holiday[], attendances: Attendance[]) {
        let data_skeleton = {};
        let managers: User[] = [];
        let zone_managers: User[] = [];

        // get skeleton
        for (let user of users) {
            data_skeleton[user.id] = AppConstants.prepareMonthOrderSkeleton(this.month, this.year, holidays);
        }

        // prepare order skeleton
        for (let order of orders) {

            // add user if not present
            if (!data_skeleton.hasOwnProperty(order.created_by)) {
                data_skeleton[order.created_by] = AppConstants.prepareMonthOrderSkeleton(this.month, this.year, holidays);
                users.push(order.creator);
            }

            // set order details
            data_skeleton[order.created_by][order.order_day - 1].order_total_count = order.order_total_count;
        }

        // add attendance to visit skeleton
        for (let att of attendances) {
            // set visit details
            data_skeleton[att.created_by][moment(att.date, "YYYY-MM-DD").date() - 1].attendance = att;
        }

        // add skeleton to user
        for (let user of users) {
            if (data_skeleton.hasOwnProperty(user.id))
                user.orders = data_skeleton[user.id];
            else
                user.orders = AppConstants.prepareMonthOrderSkeleton(this.month, this.year, holidays);

            // separate csm and zsm
            if (user.role_str == this.ROLE_CSM) {
                managers.push(user);
            } else if (user.role_str == this.ROLE_ZSM) {
                zone_managers.push(user);
            }
        }

        // if user is zone manager add it to list
        if (this._service.user.role_str == this.ROLE_ZSM) {
            this._service.user.orders = AppConstants.prepareMonthOrderSkeleton(this.month, this.year, holidays);
            this._service.user.children = [];
            this._service.user.cse_count = 0;
            zone_managers.push(this._service.user)
        }

        // if user is zone manager add it to list
        if (this._service.user.role_str == this.ROLE_CSM) {
            this._service.user.orders = AppConstants.prepareMonthOrderSkeleton(this.month, this.year, holidays);
            this._service.user.children = [];
            managers.push(this._service.user)
        }

        // add children to managers
        for (let u of users) {
            for (let m of managers) {
                if (u.manager_id == m.id) {
                    m.children.push(u);
                }
            }
        }

        // add to zone manager
        for (let z of zone_managers) {
            for (let m of managers) {
                if (m.manager_id == z.id) {
                    z.children.push(m);
                }
            }
        }

        // depending on list show view
        if (zone_managers.length > 0)
            this.managers = zone_managers;
        else
            this.managers = managers;
    }

    /**
     * fetch server data for visits
     */
    fetchData() {
        this.loading = true;
        Observable.forkJoin(
            this.attendanceService.forChildren(this.month + 1, this.year, this.role_id, this.manager_id),
            this.orderService.monthlyCountForChildren(this.month + 1, this.year, this.role_id, this.manager_id)
        ).subscribe(data => {

            this.loading = false;

            // convert to models
            let children = data[1].children.map(function (user, index) {
                return new User(user);
            });

            this.addOrderToSkeleton(children, data[1].orders, data[1].holidays, data[0].attendances);
        }, err => {
            this.loading = false;
        });
    }

    /**
     * month and year changed
     *
     * @param date
     */
    monthYearChanged(date) {
        this.month = date.month;
        this.year = date.year;
        this.fetchData();
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
        this.fetchData();
    }
}
