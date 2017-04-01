import {Model} from "../model";
import {Attendance} from "../attendance/attendance";
import {AppConstants} from "../../app.constants";
import {Tour} from "../tour_program/tour";
import {Headquarter} from "../territory/headquarter";

export class User extends Model {

    full_name: string;
    mobile: string;
    username: string;
    password: string;
    joining_date: string;
    leaving_date: string;
    status: string;
    auth_token: string;
    role_id: number;
    role_str: string;
    manager_id: number;
    unread_count: number = 0;

    // territory changes
    hq_country_id: number;
    hq_region_id: number;
    hq_area_id: number;
    hq_headquarter_id: number;
    hq_territory_id: number;
    hq_brick_id: number;
    hq_headquarter: Headquarter;


    // manager
    manager: User;

    // for local use only
    attendances = [];
    visits = [];
    orders = [];
    tours: Tour[] = [];
    children: User[] = [];
    cse_count: number = 0;

    constructor(info: any) {
        super(info.id);
        this.full_name = info.full_name;
        this.mobile = info.mobile;
        this.username = info.username;
        this.password = info.password;
        this.joining_date = info.joining_date;
        this.leaving_date = info.leaving_date;
        this.status = info.status;
        this.auth_token = info.auth_token;
        this.role_id = info.role_id;
        this.role_str = info.role_str;
        this.attendances = info.attendances;
        this.manager = info.manager;
        this.hq_region_id = info.hq_region_id;
        this.hq_area_id = info.hq_area_id;
        this.hq_headquarter_id = info.hq_headquarter_id;
        this.hq_territory_id = info.hq_territory_id;
        this.hq_brick_id = info.hq_brick_id;
        this.hq_country_id = info.hq_country_id;
        this.manager_id = info.manager_id;
        if (info.hq_headquarter)
            this.hq_headquarter = new Headquarter(info.hq_headquarter)
    }

    /**
     * if role is less then 3
     * @returns {boolean}
     */
    get isLastChild(): boolean {
        return this.role_str == AppConstants.ROLE_CSE;
    }

    /**
     * working field days count
     *
     * @returns {number}
     */
    get field_work_count(): number {
        return this.attendances.filter(function (att, index) {
            if (att.work_type)
                return att.work_type.name == AppConstants.FIELD_WORK;
            return false;
        }).length;
    }

    /**
     * meeting days count
     *
     * @returns {number}
     */
    get meeting_count(): number {
        return this.attendances.filter(function (att, index) {
            if (att.work_type)
                return att.work_type.name == AppConstants.MEETING;
            return false;
        }).length;
    }

    /**
     * leave days count
     *
     * @returns {number}
     */
    get leave_count(): number {
        return this.attendances.filter(function (att, index) {
            return att.status == AppConstants.LEAVE;
        }).length;
    }

    /**
     * holiday days count
     *
     * @returns {number}
     */
    get holiday_count(): number {
        return this.attendances.filter(function (att, index) {
            return att.status == AppConstants.HOLIDAY;
        }).length;
    }

    /**
     * Check For Admin
     *
     * @returns {boolean}
     */
    get isAdmin(): boolean {
        return this.role_str == AppConstants.ROLE_ADMIN;
    }

    /**
     * Check For Region
     *
     * @returns {boolean}
     */
    get isRegion(): boolean {
        return this.role_str == AppConstants.ROLE_ZSM;
    }

    /**
     * Check For Area
     *
     * @returns {boolean}
     */
    get isArea(): boolean {
        return this.role_str == AppConstants.ROLE_CSM;
    }

    /**
     * Check For Headquarter
     *
     * @returns {boolean}
     */
    get isHeadquarter(): boolean {
        return this.role_str == AppConstants.ROLE_CSE;
    }
}
