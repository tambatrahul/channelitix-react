import {Component} from "@angular/core";
import * as moment from "moment";
import {User} from "../../../../models/user/user";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {AuthService} from "../../../../services/AuthService";
import {OrderService} from "../../../../services/order.service";
import {Order} from "../../../../models/order/order";
import {Holiday} from "../../../../models/holiday";
import {AttendanceService} from "../../../../services/attendance.service";
import {AppConstants} from "../../../../app.constants";
import {Observable} from "rxjs/Rx";
declare let jQuery: any;
declare let swal: any;

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class ManagerSyncOrderComponent extends BaseAuthComponent {

    excel_loaded: boolean = false;

    table_list;
    btn_loading: boolean = false;

    /**
     * user id
     */
    user: User;

    /**
     * date
     */
    date: number;

    /**
     * manager and user Role id
     * @type {number}
     */
    public role_id: number = 0;

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
     * fetch server data for visits
     */
    fetchData() {
        this.loading = true;
        Observable.forkJoin(
            this.orderService.area_manager_sync_orders(this.month + 1, this.year, this.role_id, this.manager_id),
            this.orderService.region_manager_sync_orders(this.month + 1, this.year, this.role_id, this.manager_id)
        ).subscribe(data => {

            this.loading = false;
            // format orders
            let area_orders = data[0].orders.map(order => new Order(order));

            let region_orders = data[1].orders.map(order => new Order(order));

            // convert to models
            let children = data[1].children.map(function (user, index) {
                return new User(user);
            });

            this.prepareData(children, area_orders, region_orders, data[1].holidays);

        }, err => {
            this.loading = false;
        });

    }

    /**
     * Prepare Data
     *
     * @param users
     * @param area_orders
     * @param region_orders
     * @param holidays
     */
    prepareData(users: User[], area_orders: Order[], region_orders: Order[], holidays: Holiday[]) {
        let data_skeleton = {};
        let managers: User[] = [];
        let zone_managers: User[] = [];

        // prepare order skeleton
        for (let order of area_orders) {
            // add user if not present
            if (!data_skeleton.hasOwnProperty(order.hq_area_id)) {
                data_skeleton[order.hq_area_id] = AppConstants.prepareMonthOrderSkeleton(this.month, this.year, holidays);
            }

            // set order details
            data_skeleton[order.hq_area_id][order.order_day - 1].order_day_total_count = order.order_day_total_count;
            data_skeleton[order.hq_area_id][order.order_day - 1].order_total_quantity = order.order_total_quantity;
        }

        // add skeleton to user
        for (let user of users) {
            if (data_skeleton.hasOwnProperty(user.hq_area_id))
                user.orders = data_skeleton[user.hq_area_id];
            else
                user.orders = AppConstants.prepareMonthOrderSkeleton(this.month, this.year, holidays);

            // separate csm and zsm
            if (user.role_str == this.ROLE_CSM) {
                managers.push(user);
            } else if (user.role_str == this.ROLE_RSM) {
                zone_managers.push(user);
            }
        }

        // if user is zone manager add it to list
        if (this._service.user.role_str == this.ROLE_CSM) {
            this._service.user.orders = AppConstants.prepareMonthOrderSkeleton(this.month, this.year, holidays);
            this._service.user.children = [];
            managers.push(this._service.user)
        }

        // if user is zone manager add it to list
        if (this._service.user.role_str == this.ROLE_RSM || this._service.user.role_str == this.ROLE_THIRD_PARTY) {
            this._service.user.children = [];
            zone_managers.push(this._service.user)
        }

        // add to zone manager
        for (let z of zone_managers) {
            z.orders = AppConstants.prepareMonthOrderSkeleton(this.month, this.year, holidays);
            z.order_total_count =0;
            for (let m of managers) {
                if (m.manager_id == z.id) {
                    z.children.push(m);
                    m.orders.map(function (ord) {
                       m.order_total_count += +ord.order_day_total_count;
                    });
                }
               if (this._service.user.role_str == this.ROLE_THIRD_PARTY && m.hq_region_id == z.hq_region_id ) {
                   z.children.push(m);
                   m.orders.map(function (ord) {
                      m.order_total_count += +ord.order_day_total_count;
                   });
              }
            }

            for (let order of region_orders) {
                if (order.hq_region_id == z.id) {
                    z.orders[order.order_day - 1].order_day_total_count = order.order_day_total_count;
                }
            }

            z.orders.map(function (ord) {
                z.order_total_count += +ord.order_day_total_count;
            });
        }

        this.managers = zone_managers;
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
}
