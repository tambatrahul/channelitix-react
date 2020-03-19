import {Injectable} from '@angular/core';
import {Http, RequestOptions, Response, ResponseContentType, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from './AuthService';
import {BaseService} from './base.service';
import {Result} from '../models/result';
import {Attendance} from '../models/attendance/attendance';
import {Expense} from '../models/expense/expense';


@Injectable()
export class ExpenseService extends BaseService {

  /**
   * model url
   *
   * @type {string}
   */
  protected modelUrl: string = 'expenses';

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
   * get all expenses
   *
   * @param month
   * @param year
   * @param region_id
   * @param area_id
   * @param headquarter_id
   * @param first_fortnight_expense
   * @param second_fortnight_expense
   * @returns {Observable<Result>}
   */
  all(month: number, year: number, region_id?: number, area_id?: number, headquarter_id?: number,
      first_fortnight_expense?: boolean, second_fortnight_expense?: boolean): Observable<Result> {

    // prepare url
    let url = this.getBaseUrl();
    // prepare get params
    let params = new URLSearchParams();
    params.set('region_id', String(region_id > 0 ? region_id : ''));
    params.set('area_id', String(area_id > 0 ? area_id : ''));
    params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));
    params.set('month', String(month > 0 ? month : ''));
    params.set('year', String(year > 0 ? year : ''));
    params.set('first_fortnight_expense', String(first_fortnight_expense));
    params.set('second_fortnight_expense', String(second_fortnight_expense));

    // make server call
    return this.get(url, new RequestOptions({search: params}));
  }

  /**
   * monthly expenses
   *
   * @param month
   * @param year
   * @param region_id
   * @param area_id
   * @param headquarter_id
   * @param status
   * @returns {Observable<Result>}
   */
  forRep(month: number, year: number, region_id?: number, area_id?: number, headquarter_id?: number, status?: string): Observable<Result> {

    // prepare url
    let url = this.getBaseUrl() + '/monthly/forRep/' + month + '/' + year;
    // prepare get params
    let params = new URLSearchParams();
    params.set('region_id', String(region_id > 0 ? region_id : ''));
    params.set('area_id', String(area_id > 0 ? area_id : ''));
    params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));
    params.set('status', String(status ? status : ''));

    // make server call
    return this.get(url, new RequestOptions({search: params}));
  }

  /**
   * expenses
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
   * Approve Expenses
   *
   * @param first_fortnight_expense
   * @param second_fortnight_expense
   * @param month
   * @param year
   */
  approve(first_fortnight_expense?: boolean, second_fortnight_expense?: boolean, month?: number, year?: number): Observable<Result> {
    let params = new URLSearchParams();
    params.set('first_fortnight_expense', String(first_fortnight_expense));
    params.set('second_fortnight_expense', String(second_fortnight_expense));
    params.set('month', String(month > 0 ? month : ''));
    params.set('year', String(year > 0 ? year : ''));

    return this.get(this.getBaseUrl() + '/approve', new RequestOptions({search: params}));
  }

  /**
   * Rejecte Expenses
   *
   * @param first_fortnight_expense
   * @param second_fortnight_expense
   * @param month
   * @param year
   */
  reject(first_fortnight_expense?: boolean, second_fortnight_expense?: boolean, month?: number, year?: number): Observable<Result> {
    let params = new URLSearchParams();
    params.set('first_fortnight_expense', String(first_fortnight_expense));
    params.set('second_fortnight_expense', String(second_fortnight_expense));
    params.set('month', String(month > 0 ? month : ''));
    params.set('year', String(year > 0 ? year : ''));

    return this.get(this.getBaseUrl() + '/reject', new RequestOptions({search: params}));
  }

  /**
   * Approve Manager Expenses
   *
   * @param first_fortnight_expense
   * @param second_fortnight_expense
   * @param month
   * @param year
   * @param headquarter_id
   */
  manager_approve(first_fortnight_expense?: boolean, second_fortnight_expense?: boolean, month?: number, year?: number,
                  headquarter_id?: number): Observable<Result> {
    let params = new URLSearchParams();
    params.set('first_fortnight_expense', String(first_fortnight_expense));
    params.set('second_fortnight_expense', String(second_fortnight_expense));
    params.set('month', String(month > 0 ? month : ''));
    params.set('year', String(year > 0 ? year : ''));
    params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));

    return this.get(this.getBaseUrl() + '/manager_approve', new RequestOptions({search: params}));
  }

  /**
   * Rejecte Manager Expenses
   *
   * @param first_fortnight_expense
   * @param second_fortnight_expense
   * @param month
   * @param year
   * @param headquarter_id
   */
  manager_reject(first_fortnight_expense?: boolean, second_fortnight_expense?: boolean, month?: number, year?: number,
                 headquarter_id?: number): Observable<Result> {
    let params = new URLSearchParams();
    params.set('first_fortnight_expense', String(first_fortnight_expense));
    params.set('second_fortnight_expense', String(second_fortnight_expense));
    params.set('month', String(month > 0 ? month : ''));
    params.set('year', String(year > 0 ? year : ''));
    params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));

    return this.get(this.getBaseUrl() + '/manager_reject', new RequestOptions({search: params}));
  }

  /**
   * Approve Manager Expenses
   *
   * @param title
   * @param first_fortnight_expense
   * @param second_fortnight_expense
   * @param month
   * @param year
   * @param comments
   */
  request_to_edit_expense(title?: string, first_fortnight_expense?: boolean, second_fortnight_expense?: boolean, month?: number, year?: number,
                          comments?: string): Observable<Result> {
    return this.post(this.getBaseUrl() + '/requestToEditExpense', {
      title: title,
      first_fortnight_expense: first_fortnight_expense,
      second_fortnight_expense: second_fortnight_expense,
      month: month,
      year: year,
      comments: comments,
    });
  }

  /**
   * get all orders
   */
  expense_excel_download(month: number, year: number, fortnight?: string, hq_region_id?: number, hq_area_id?: number): Observable<Response> {

    // prepare get params
    let params = new URLSearchParams();
    params.set('fortnight', String(fortnight.length > 0 ? fortnight : ''));
    params.set('region_id', String(hq_region_id > 0 ? hq_region_id : ''));
    params.set('area_id', String(hq_area_id > 0 ? hq_area_id : ''));

    // get request with headers
    let content = this.addCredentials(new RequestOptions({
      responseType: ResponseContentType.Blob,
      search: params
    }));

    // make server call
    return this.http.get(this.getBaseUrl() + '/excel_download/' + month + '/' + year, content);

  }
}
