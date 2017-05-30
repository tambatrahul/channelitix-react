import * as moment from "moment";
import {Attendance} from "./models/attendance/attendance";
import {Role} from "./models/role";
import {Visit} from "./models/visit/visit";
import {Holiday} from "./models/holiday";
import {Order} from "./models/order/order";
import {Tour} from "./models/tour_program/tour";
import {environment} from "../environments/environment";

export class AppConstants {
    static API_ENDPOINT: string = environment.server_url;
    // static API_ENDPOINT: string = 'http://master.channelitix.com/api/v1/';
    // static API_ENDPOINT: string = 'http://35.189.172.175/api/v1/';
    // static API_ENDPOINT: string = 'http://104.198.41.92/api/v1/';
    // static API_ENDPOINT: string = '/api/v1/';
    static EMAIL_REGEX: string = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

    // roles of user
    static ROLE_CSE = 'HQ_MNG';
    static ROLE_CSM = 'AREA_MNG';
    static ROLE_ZSM = 'REGION_MNG';
    static ROLE_ADMIN = 'COUNTRY_MNG';
    static roles: Array<Role> = [
        new Role({id: 6, name: AppConstants.ROLE_ADMIN, title: 'ADMIN'}),
        new Role({id: 5, name: AppConstants.ROLE_ZSM, title: 'ZSM'}),
        new Role({id: 4, name: AppConstants.ROLE_CSM, title: 'CSM'}),
        new Role({id: 3, name: AppConstants.ROLE_CSE, title: 'CSE'})
    ];

    // stations for brick and territory
    static stations: Array<string> = [
        'HQ', 'OS', 'EX'
    ];

    // week days
    static week_days: Array<string> = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    static months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    // attendance static values
    static WORKING: string = 'working';
    static LEAVE: string = 'leave';
    static HOLIDAY: string = 'holiday';

    // dates selection constants
    static DAILY: string = 'day';
    static MONTHLY: string = 'month';
    static YEARLY: string = 'year';
    static date_types: Array<string> = ['day', 'month'];

    static OPEN: string = 'open';
    static CLOSED: string = 'closed';
    static $reporting_statuses = [
        AppConstants.OPEN,
        AppConstants.CLOSED
    ];

    // tour types
    static FIELD_WORK = 'Field Work';
    static MEETING = 'Meeting';
    static TRANSIT = 'Transit';
    static tour_types: Array<string> = [
        AppConstants.FIELD_WORK, AppConstants.MEETING, AppConstants.TRANSIT, AppConstants.LEAVE, AppConstants.HOLIDAY
    ];

    /**
     * return string month
     *
     * @param id
     * @returns {string}
     */
    static getMonth(id) {
        return AppConstants.months[id];
    }

    /**
     * get list of all child roles
     *
     * @param role_id
     */
    static getChildRoles(role_id) {
        return AppConstants.roles.filter(role => role.id < role_id)
    }

    /**
     * get list of all third party child roles
     *
     * @param role_id
     */
    static getThirdPartyChildRoles(role_id) {
        return AppConstants.roles.filter(role => role.id < role_id)
    }

    /**
     * get role from id
     * @param role_id
     * @returns {Role}
     */
    static getRole(role_id) {
        let role = AppConstants.roles.filter(role => role.id == role_id)[0];
        return role ? role : {name: ""}
    }

    /**
     * get id from role name
     * @param name
     * @returns number
     */
    static getRoleId(name): number {
        let role_id = AppConstants.roles.filter(role => role.name == name)[0].id;
        return role_id ? role_id : 0;
    }

    /**
     * Prepare monthly attendance Skeleton
     *
     * @param month
     * @param year
     * @param holidays
     * @param joining_date
     * @param leaving_date
     */
    static prepareMonthAttendanceSkeleton(month: number, year: number, holidays: Holiday[],
                                          joining_date: string, leaving_date: string) {

        // get date
        let date = moment().year(year).month(month);

        // get start date and end date of month
        let start_day = date.startOf('month').date();
        let end_day = date.endOf('month').date();

        // get joining date
        let jd = moment(joining_date, "YYYY-MM-DD");

        // get leaving date
        let ld = moment(leaving_date, "YYYY-MM-DD");

        // prepare skeleton for all date
        let skeleton = new Array(end_day);
        for (let date = start_day; date <= end_day; date++) {
            // get current date
            let current_date = moment().month(month).year(year).date(date);

            // set visit
            skeleton[date - 1] = new Attendance({day: date, date: current_date.format('YYYY-MM-DD')});

            // not put before joining date attendance or not put after leaving date attendance
            if ((jd != null && current_date < jd) || (ld != null && current_date > ld)) {
                skeleton[date - 1].isDisabled = true;
            }

            // set sunday
            if (current_date.day() == 0)
                skeleton[date - 1].isSunday = true;
        }

        // adding holidays
        for (let holiday of holidays) {
            skeleton[moment(holiday.date).date() - 1].isHoliday = true;
            skeleton[moment(holiday.date).date() - 1].status = AppConstants.HOLIDAY;
        }

        return skeleton;
    }

    /**
     * Prepare month Visit Skeleton
     *
     * @param month
     * @param year
     * @param holidays
     */
    static prepareMonthVisitSkeleton(month: number, year: number, holidays: Holiday[]): Array<Visit> {

        // get date
        let date = moment().year(year).month(month);

        // get start date and end date of month
        let start_day: number = date.startOf('month').date();
        let end_day: number = date.endOf('month').date();

        // prepare skeleton for all date
        let skeleton = new Array<Visit>(end_day);
        for (let date: number = start_day; date <= end_day; date++) {

            // set visit
            skeleton[date - 1] = new Visit({});

            // set sunday
            let current_date = moment().month(month).year(year).date(date);
            if (current_date.day() == 0)
                skeleton[date - 1].isSunday = true;
        }

        // adding holidays
        for (let holiday of holidays) {
            skeleton[moment(holiday.date).date() - 1].isSunday = true;
        }

        return skeleton;
    }

    /**
     * Prepare month Order Skeleton
     *
     * @param month
     * @param year
     * @param holidays
     */
    static prepareMonthOrderSkeleton(month: number, year: number, holidays: Holiday[]) {

        // get date
        let date = moment().year(year).month(month);

        // get start date and end date of month
        let start_day = date.startOf('month').date();
        let end_day = date.endOf('month').date();

        // prepare skeleton for all date
        let skeleton = new Array(end_day);
        for (let date = start_day; date <= end_day; date++) {

            // set order
            skeleton[date - 1] = new Order({});

            // set sunday
            let current_date = moment().month(month).year(year).date(date);
            if (current_date.day() == 0)
                skeleton[date - 1].isSunday = true;
        }

        // adding holidays
        for (let holiday of holidays) {
            skeleton[moment(holiday.date).date() - 1].isSunday = true;
        }

        return skeleton;
    }

    /**
     * Prepare skeleton for month
     *
     * @param month
     * @param year
     * @param holidays
     * @returns {any[]}
     */
    static prepareSkeletonForMonth(month: number, year, holidays: Holiday[]) {
        // get date
        let date = moment().year(year).month(month);

        // get start date and end date of month
        let start_day = date.startOf('month').date();
        let end_day = date.endOf('month').date();

        // prepare skeleton for all date
        let skeleton = Array<number>(date.endOf('month').date()).fill(0);

        for (let date = start_day; date <= end_day; date++) {

            // set sunday
            let current_date = moment().month(month).year(year).date(date);
            if (current_date.day() == 0)
                skeleton[date - 1] = -1;
        }

        // adding holidays
        for (let holiday of holidays) {
            skeleton[moment(holiday.date).date() - 1] = -1;
        }

        return skeleton;
    }

    /**
     * Prepare monthly tour Skeleton
     *
     * @param month
     * @param year
     * @param holidays
     */
    static prepareMonthTourSkeleton(month: number, year: number, holidays: Holiday[]) {

        // get date
        let date = moment().year(year).month(month);

        // get start date and end date of month
        let start_day = date.startOf('month').date();
        let end_day = date.endOf('month').date();

        // prepare skeleton for all date
        let skeleton = new Array<Tour>(end_day);
        for (let date = start_day; date <= end_day; date++) {

            // get current date
            let current_date = moment().month(month).year(year).date(date);

            // set visit
            skeleton[date - 1] = new Tour({day: date, date: current_date.format('YYYY-MM-DD')});

            // set sundays
            if (current_date.day() == 0)
                skeleton[date - 1].isSunday = true;
        }

        // adding holidays
        for (let holiday of holidays) {
            skeleton[moment(holiday.date).date() - 1].isHoliday = true;
        }

        return skeleton;
    }
}
