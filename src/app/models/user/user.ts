import {Model} from "../model";
import {Attendance} from "../attendance/attendance";
import {AppConstants} from "../../app.constants";

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

    // manager
    manager: User;

    // for local use only
    attendances = [];
    visits = [];
    orders = [];

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
        this.attendances = info.attendances;
        this.manager = info.manager;
    }

    /**
     * if role is less then 3
     * @returns {boolean}
     */
    get isLastChild(): boolean {
        return this.role_id < 4;
    }

    /**
     * working field days count
     *
     * @returns {number}
     */
    get field_work_count(): number {
        return this.attendances.filter(function (att, index) {
            if (att.work_type)
                return att.work_type.name == "Field Work";
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
                return att.work_type.name == "Meeting";
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
}
