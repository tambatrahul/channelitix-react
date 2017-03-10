import * as moment from "moment";
import {Attendance} from "./models/attendance/attendance";
import {Role} from "./models/role";
import {Visit} from "./models/visit/visit";
import {Holiday} from "./models/holiday";
import {Order} from "./models/order/order";

export class AppConstants {
    static API_ENDPOINT: string = 'http://master.channelitix.com/api/v1/';
    static EMAIL_REGEX: string = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

    // roles of user
    static roles: Array<Role> = [
        new Role({id: 6, name: 'COUNTRY_MNG', title: 'Country Managers'}),
        new Role({id: 5, name: 'REGION_MNG', title: 'Region Managers'}),
        new Role({id: 4, name: 'AREA_MNG', title: 'Area Managers'}),
        new Role({id: 3, name: 'HQ_MNG', title: 'Territory Managers'}),
        new Role({id: 2, name: 'TERRITORY_MNG', title: 'Medical Reps'})
    ];

    // attendance static values
    static WORKING: string = 'working';
    static LEAVE: string = 'leave';
    static HOLIDAY: string = 'holiday';

    // dates selection constants
    static DAILY: string = 'day';
    static MONTHLY: string = 'month';
    static YEARLY: string = 'year';
    static date_types: Array<string> = ['day', 'month'];

    /**
     * get list of all child roles
     *
     * @param role_id
     */
    static getChildRoles(role_id) {
        return this.roles.filter(role => role.id < role_id)
    }

    /**
     * get role from id
     * @param role_id
     * @returns {Role}
     */
    static getRole(role_id) {
        return this.roles.filter(role => role.id == role_id)[0]
    }

    /**
     * Prepare monthly attendance Skeleton
     *
     * @param month
     * @param year
     * @param holidays
     */
    static prepareMonthAttendanceSkeleton(month: number, year: number, holidays: Holiday[]) {

        // get date
        let date = moment().year(year).month(month);

        // get start date and end date of month
        let start_day = date.startOf('month').date();
        let end_day = date.endOf('month').date();

        // prepare skeleton for all date
        let skeleton = new Array(end_day);
        for (let date = start_day; date <= end_day; date++) {
            // set visit
            skeleton[date - 1] = new Attendance({});

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
     * Prepare month Visit Skeleton
     *
     * @param month
     * @param year
     * @param holidays
     */
    static prepareMonthVisitSkeleton(month: number, year: number, holidays: Holiday[]) {

        // get date
        let date = moment().year(year).month(month);

        // get start date and end date of month
        let start_day = date.startOf('month').date();
        let end_day = date.endOf('month').date();

        // prepare skeleton for all date
        let skeleton = new Array(end_day);
        for (let date = start_day; date <= end_day; date++) {

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
}
