import {BaseAuthComponent} from "./base_auth.component";
import * as moment from "moment";
declare let jQuery: any;


export abstract class BaseMonthlyComponent extends BaseAuthComponent {

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
     *
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
     * fetch function to be created in child
     */
    abstract fetch();

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        super.ngOnInit();
        this.month = moment().month();
        this.year = moment().year();
        this.fetch();
    }

    /**
     * month and year changed
     *
     * @param date
     */
    monthYearChanged(date) {
        this.month = date.month;
        this.year = date.year;
        this.fetch();
    }

    /**
     * when role is changed filter list of tours
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
        this.fetch();
    }
}
