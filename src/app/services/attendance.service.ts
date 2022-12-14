import {Injectable} from '@angular/core';
import {Http, URLSearchParams, RequestOptions, Response, ResponseContentType} from '@angular/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from './AuthService';
import {BaseService} from './base.service';
import {Result} from '../models/result';
import {Attendance} from '../models/attendance/attendance';


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
    let url = this.getBaseUrl() + '/monthly/' + month + '/' + year;

    // make server call
    return this.get(url, new RequestOptions());
  }

  /**
   * get attendance report
   */
  forChildren(month: number, year: number, role_id?: number, manager_id?: number, synergy?: number, zone_id?: number, department_id?: number): Observable<Result> {

    // prepare url
    let url = this.getBaseUrl() + '/monthly/forChildren/' + month + '/' + year;

    // prepare get params
    let params = new URLSearchParams();
    params.set('role_id', String(role_id > 0 ? role_id : ''));
    params.set('manager_id', String(manager_id > 0 ? manager_id : ''));
    params.set('synergy', String(synergy ? synergy : ''));
    params.set('zone_id', String(zone_id ? zone_id : ''));
    params.set('department_id', String(department_id ? department_id : ''));

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
   * Create new temp attendance
   *
   * @param attendance
   */
  temp_create(attendance: Attendance): Observable<Result> {
    attendance.working_with_id = attendance.working_with_id > 0 ? attendance.working_with_id : null;
    attendance.leave_type_id = attendance.leave_type_id > 0 ? attendance.leave_type_id : null;
    attendance.work_type_id = attendance.work_type_id > 0 ? attendance.work_type_id : null;
    attendance.no_of_calls = attendance.no_of_calls > 0 ? attendance.no_of_calls : null;

    return this.post(this.getBaseUrl() + "/temp_store", attendance);
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
   * @returns {Observable<Result>}
   */
  reportForDate(date: string) {
    return this.get(this.getBaseUrl() + '/' + date + '/report');
  }

  /**
   * reporting for date
   *
   * @param date
   * @param data
   * @returns {Observable<Result>}
   */
  report(date: string, data) {
    return this.post(this.getBaseUrl() + '/' + date + '/report', data);
  }

  /**
   * reporting for date
   *
   * @param data
   * @returns {Observable<Result>}
   */
  update_mobile_while_reporting(data) {
    return this.post(this.getBaseUrl() + '/update-mobile-while-reporting', data);
  }

  /**
   * reporting for date
   *
   * @param date
   * @param data
   * @returns {Observable<Result>}
   */
  report_submit(date: string) {
    return this.post(this.getBaseUrl() + '/' + date + '/submit_report');
  }

  /**
   * Leave Report
   *
   * @param month
   * @param year
   * @param zone_id
   * @param region_id
   * @returns {Observable<Result>}
   */
  leave_report(month: number, year: number, region_id?: number, zone_id?: number): Observable<Result> {

    // prepare url
    let url = this.getBaseUrl() + '/leave_report/' + month + '/' + year;

    // prepare get params
    let params = new URLSearchParams();
    params.set('zone_id', String(zone_id > 0 ? zone_id : ''));
    params.set('region_id', String(region_id > 0 ? region_id : ''));

    // make server call
    return this.get(url, new RequestOptions({search: params}));
  }

  /**
   * get all orders
   */
  leave_report_excel_download(month: number, year: number, role_id?: number, manager_id?: number, zone_id?: number): Observable<Response> {

    // prepare get params
    let params = new URLSearchParams();
    params.set('role_id', String(role_id > 0 ? role_id : ''));
    params.set('manager_id', String(manager_id > 0 ? manager_id : ''));
    params.set('zone_id', String(zone_id > 0 ? zone_id : ''));

    // get request with headers
    let content = this.addCredentials(new RequestOptions({
      responseType: ResponseContentType.Blob,
      search: params
    }));

    // make server call
    return this.http.get(this.getBaseUrl() + '/leave_report/' + month + '/' + year + '/' + 'excel_download', content);

  }

  fetchPendingLeaveApproval(month: number, year: number, user_id?: number): Observable<Result> {

    let url = this.getBaseUrl() + '/pending-leave-approval';

    let params = new URLSearchParams();
    params.set('month', String(month > 0 ? month : ''));
    params.set('year', String(year > 0 ? year : ''));
    params.set('user_id', String(user_id > 0 ? user_id : ''));

    return this.get(url, new RequestOptions({search: params}));
  }

  /**
   * Approved leave
   */
  approveLeave(id): Observable<Result> {
    return this.put(this.getBaseUrl() + '/' + id + '/approve-leave');
  }

  /**
   * Rejected leave
   */
  rejectedLeave(id): Observable<Result> {
    return this.put(this.getBaseUrl() + '/' + id + '/reject-leave');
  }
}
