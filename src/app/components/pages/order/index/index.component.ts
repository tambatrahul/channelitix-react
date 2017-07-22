import {Component, ViewChild, ElementRef} from "@angular/core";
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
import {Target} from "../../../../models/SAP/target";
declare let jQuery: any;
declare let swal: any;

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class OrderComponent extends BaseAuthComponent {

    excel_loaded: boolean = false;
    table_list;

    /**
     * user tour program modal loading identifier
     */
    @ViewChild('user_order_table')
    user_order_table: ElementRef;

    /**
     * manager and user Role id
     * @type {number}
     */
    public role_id: number = 0;
    public manager_role_id: number = 0;

    /**
     * Product Id
     */
    public product_id: number = 0;

    /**
     * user id
     */
    user: User;

    /**
     * date
     */
    date: number;

    /**
     * abbott check
     *
     * @type {boolean}
     */
    public abbott: boolean = false;

    /**
     * view by quantity
     *
     * @type {boolean}
     */
    public view_quantity: boolean = false;

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
        if (this._service.user.username == 'abbottadmin') {
            this.abbott = true;
        }
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
     * @param targets
     */
    addOrderToSkeleton(users: User[], orders: Order[], holidays: Holiday[], attendances: Attendance[], targets: Target[]) {
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

            data_skeleton[order.created_by][order.order_day - 1].order_total_quantity = order.order_total_quantity;
        }

        // add attendance to visit skeleton
        for (let att of attendances) {
            if (data_skeleton.hasOwnProperty(att.created_by)) {
                data_skeleton[att.created_by][moment(att.date, "YYYY-MM-DD").date() - 1].attendance = att;
                if (data_skeleton[att.created_by][moment(att.date, "YYYY-MM-DD").date() - 1].order_total_count == 0
                    && att.status == AppConstants.WORKING)
                    data_skeleton[att.created_by][moment(att.date, "YYYY-MM-DD").date() - 1].order_total_count = att.pob_amount;
            }
        }

        // add skeleton to user
        for (let user of users) {
            targets.map(target => {
                if (target.hq_headquarter_id == user.hq_headquarter_id)
                    user.total_target = target.total_target;
            });

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
        if (this._service.user.role_str == this.ROLE_ZSM && !this.abbott) {
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

                    u.orders.forEach(function (ord, index) {
                        if (m.children.length == 1) {
                            m.orders[index].order_total_count = 0;
                            m.orders[index].order_total_quantity = 0;
                        }
                        m.orders[index].order_total_count += ord.order_total_count;
                        m.orders[index].order_total_quantity += ord.order_total_quantity;
                    });
                    m.total_target += u.total_target;
                }
            }
        }

        // add to zone manager
        for (let z of zone_managers) {
            z.total_target = 0;
            for (let m of managers) {
                if (m.manager_id == z.id) {
                    z.children.push(m);
                    m.orders.forEach(function (ord, index) {
                        if (z.children.length == 1) {
                            z.orders[index].order_total_count = 0;
                            z.orders[index].order_total_quantity = 0;
                        }
                        z.orders[index].order_total_count += ord.order_total_count;
                        z.orders[index].order_total_quantity += ord.order_total_quantity;
                    });
                    z.total_target += m.total_target;
                }
            }
        }

        if (this._service.user.role_str == this.ROLE_ADMIN && this.abbott && this.environment.envName == 'sk_group') {
            let abbott_user = new User({full_name: 'Abbott'});
            abbott_user.visits = AppConstants.prepareMonthVisitSkeleton(this.month, this.year, holidays);
            abbott_user.children = [];
            abbott_user.cse_count = 0;
            abbott_user.orders = AppConstants.prepareMonthOrderSkeleton(this.month, this.year, holidays);
            zone_managers.push(abbott_user);
            for (let m of managers) {
                zone_managers[0].children.push(m);
                m.visits.forEach(function (att, index) {
                    zone_managers[0].visits[index].visit_count += att.visit_count;
                });
                m.orders.forEach(function (ord, index) {
                    zone_managers[0].orders[index].order_total_count += ord.order_total_count;
                    zone_managers[0].orders[index].order_total_quantity += ord.order_total_quantity;
                });
                zone_managers[0].total_target += m.total_target;
                zone_managers[0].cse_count += m.children.length

            }
        }

        if (this.environment.envName == 'sk_group' && this.abbott && this._service.user.role_str != this.ROLE_ADMIN
            && this._service.user.role_str != this.ROLE_CSM) {
            let abbott_user = new User({full_name: 'Abbott'});
            abbott_user.orders = AppConstants.prepareMonthOrderSkeleton(this.month, this.year, holidays);
            abbott_user.children = [];
            abbott_user.orders = AppConstants.prepareMonthOrderSkeleton(this.month, this.year, holidays);
            abbott_user.cse_count = 0;
            zone_managers.push(abbott_user);
            for (let m of managers) {
                zone_managers[0].children.push(m);
                m.visits.forEach(function (att, index) {
                    zone_managers[0].visits[index].visit_count += att.visit_count;
                });
                m.orders.forEach(function (ord, index) {
                    zone_managers[0].orders[index].order_total_count += ord.order_total_count;
                    zone_managers[0].orders[index].order_total_quantity += ord.order_total_quantity;
                });
                zone_managers[0].total_target += m.total_target;
                zone_managers[0].cse_count += m.children.length

            }
        }

        // Third Party User Check
        if (this._service.user.role_str == this.ROLE_THIRD_PARTY) {
            let third_party_user = this._service.user;
            third_party_user.orders = AppConstants.prepareMonthOrderSkeleton(this.month, this.year, holidays);
            third_party_user.children = [];
            third_party_user.cse_count = 0;
            zone_managers.push(third_party_user);
            for (let m of managers) {
                zone_managers[0].children.push(m);
            }
        }

        // depending on list show view
        if (zone_managers.length > 0)
            this.managers = zone_managers;
        else
            this.managers = managers;

        setTimeout(() => {
            if (!this.excel_loaded) {
                this.excel_loaded = true;
                jQuery("table").tableExport({
                    formats: ['xlsx'],
                    bootstrap: true,
                    position: "top"
                });
            }
        }, 2000);
    }

    /**
     * fetch server data for visits
     */
    fetchData() {
        this.loading = true;

        let synergy;
        if (this.environment.envName == 'sk_group')
            synergy = this.abbott ? 1 : 0;

        Observable.forkJoin(
            this.attendanceService.forChildren(this.month + 1, this.year, this.role_id, this.manager_id, synergy),
            this.orderService.monthlyCountForChildren(this.month + 1, this.year, this.role_id, this.manager_id, synergy, this.product_id)
        ).subscribe(data => {

            this.loading = false;

            // convert to models
            let children = data[1].children.map(function (user, index) {
                return new User(user);
            });

            // format targets
            let targets = data[1].targets.map(target => new Target(target));

            // format orders
            let orders = data[1].orders.map(order => new Order(order));

            let attendances = data[0].attendances.map(att => new Attendance(att));

            this.addOrderToSkeleton(children, orders, data[1].holidays, attendances, targets);
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
        this.excel_loaded = false;
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

    /**
     * switch to abbott
     */
    switchToAbbott() {
        this.abbott = !this.abbott;
        this.productChanged(0);
        this.excel_loaded = false;
        this.fetchData();
    }

    /**
     * View by Quantity
     */
    viewByQuantity() {
        this.view_quantity = !this.view_quantity;
        this.excel_loaded = false;
        this.fetchData();
    }

    /**
     * select user to view list
     * @param user
     * @param date
     */
    selectUser(user: User, date: number, order: Order) {
        this.user = user;
        this.date = date;
        let popup_date = this.date +" "+moment().year(this.year).month(this.month).format("MMMM, YYYY");

        if (order.attendance.status == 'leave')
            swal(user.full_name + " on Leave ("+ popup_date +")");
        else if (order.attendance.status == 'holiday')
            swal(user.full_name + " on Holiday ("+ popup_date +")");
        else if (order.attendance.status == 'working'){
            if (order.attendance.work_type_id == 4)
                swal(user.full_name + " on Transit ("+ popup_date +")");
            else if (order.attendance.work_type_id == 1)
                swal(user.full_name + " on Meeting ("+ popup_date +")");
            else if (order.attendance.work_type_id == 3)
                swal(user.full_name + " on Campaign ("+ popup_date +")");
            else if (order.attendance.work_type_id == 2)
                jQuery(this.user_order_table.nativeElement).modal();
        }
    }

    /**
     * product Filter
     *
     * @param product_id
     */
    productChanged(product_id) {
        this.product_id = product_id;
        this.fetchData();
    }

    /**
     * Download Excel For Orders Report
     */
    download() {
        this.orderService.orders_excel_download(this.month + 1, this.year).subscribe(
            response => {
                let blob: Blob = response.blob();

                // Doing it this way allows you to name the file
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = "Orders_report.xls";
                link.click();
            },
            err => {

            }
        );
    }
}
