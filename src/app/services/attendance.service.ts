import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Result} from "../models/result";
import {Attendance} from "../models/attendance/attendance";


@Injectable()
export class AttendanceService extends BaseService {

    /**
     * model url
     *
     * @type {string}
     */
    protected modelUrl: string = 'attendances';

    /**
     * Attendance Service constructor
     *
     * @param http
     * @param _router
     * @param _authService
     */
    constructor(protected http: Http, protected _router: Router, protected _authService: AuthService) {
        super(http, _router, _authService);
    }

    /**
     * monthly attendance
     *
     * @param month
     * @param year
     * @returns {Observable<Result>}
     */
    monthly(month: number, year: number): Observable<Result> {

        // prepare url
        let url = this.getBaseUrl() + '/monthly/' + month + "/" + year;

        // make server call
        return this.get(url, new RequestOptions());
    }

    /**
     * get attendance report
     */
    forChildren(month: number, year: number, role_id?: number, manager_id?: number): Observable<Result> {

        // prepare url
        let url = this.getBaseUrl() + '/monthly/forChildren/' + month + "/" + year;

        // prepare get params
        let params = new URLSearchParams();
        params.set('role_id', String(role_id > 0 ? role_id : ''));
        params.set('manager_id', String(manager_id > 0 ? manager_id : ''));

        // make server call
        return this.get(url, new RequestOptions({search: params}));
    }

    /**
     * fetch all attendance masters
     *
     * @returns {Observable<Result>}
     */
    masters(): Observable<Result> {
        return this.get(this.getBaseUrl() + '/masters');
    }

    /**
     * Create new attendance
     *
     * @param attendance
     */
    create(attendance: Attendance): Observable<Result> {
        attendance.working_with_id = attendance.working_with_id > 0 ? attendance.working_with_id : null;
        attendance.leave_type_id = attendance.leave_type_id > 0 ? attendance.leave_type_id : null;
        attendance.work_type_id = attendance.work_type_id > 0 ? attendance.work_type_id : null;
        attendance.no_of_calls = attendance.no_of_calls > 0 ? attendance.no_of_calls : null;

        return this.post(this.getBaseUrl(), attendance);
    }

    /**
     * Update attendance
     *
     * @param id
     * @param attendance
     */
    update(id: number, attendance: Attendance): Observable<Result> {
        attendance.working_with_id = attendance.working_with_id > 0 ? attendance.working_with_id : null;
        attendance.leave_type_id = attendance.leave_type_id > 0 ? attendance.leave_type_id : null;
        attendance.work_type_id = attendance.work_type_id > 0 ? attendance.work_type_id : null;

        return this.put(this.getBaseUrl() + '/' + id, attendance);
    }

    /**
     * reporting for date
     *
     * @param date
     * @param data
     * @returns {Observable<Result>}
     */
    reporting(date: string, data) {
        return this.post(this.getBaseUrl() + '/' + date + '/reporting', data);
    }
}
