import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions, ResponseContentType, Response} from "@angular/http";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Observable} from "rxjs";
import {Result} from "../models/result";

@Injectable()
export class OrderService extends BaseService {

  /**
   * model url
   *
   * @type {string}
   */
  protected modelUrl: string = 'orders';

  /**
   * Order Service constructor
   *
   * @param http
   * @param _router
   * @param _authService
   */
  constructor(protected http: Http, protected _router: Router, protected _authService: AuthService) {
    super(http, _router, _authService);
  }

  /**
   * get monthly report
   */
  monthlyOrders(month: number, year: number): Observable<Result> {

    // prepare url
    let url = this.getBaseUrl() + '/monthly/' + month + "/" + year;

    // make server call
    return this.get(url);
  }

  /**
   * get monthly report
   */
  forUser(user_id: number, month: number, year: number,
        day?: number, department_id?: number, brand_id?: number, customer_type_id?: number): Observable<Result> {

    // prepare url
    let url = this.getBaseUrl() + '/forUser/' + user_id + "/" + month + "/" + year + "/" + department_id;

    // prepare get params
    let params = new URLSearchParams();
    params.set('date', String(day > 0 ? day : ''));
    params.set('customer_type_id', String(customer_type_id > 0 ? customer_type_id: ''));
    if (brand_id && brand_id > 0)
      params.set('brand_id', String(brand_id));

    // make server call
    return this.get(url, new RequestOptions({search: params}));
  }

  /**
   * get visit counts for user
   *
   * @param month
   * @param year
   * @param role_id
   * @param manager_id
   * @param synergy
   * @param customer_type_id
   * @param product_id
   * @param brand_id
   * @param zone_id
   * @param department_id
   * @returns {Observable<Result>}
   */
  monthlyCountForChildren(month: number, year: number, role_id?: number, manager_id?: number, synergy?: number, customer_type_id?: number,
                          product_id?: number, brand_id?: number, zone_id?: number, department_id?: number): Observable<Result> {

    // prepare url
    let url = this.getBaseUrl() + "/monthly/forChildren/" + month + "/" + year + "/count";

    // prepare get params
    let params = new URLSearchParams();
    params.set('role_id', String(role_id > 0 ? role_id : ''));
    params.set('manager_id', String(manager_id > 0 ? manager_id : ''));
    params.set('product_id', String(product_id > 0 ? product_id : ''));
    params.set('brand_id', String(brand_id > 0 ? brand_id : ''));
    params.set('zone_id', String(zone_id > 0 ? zone_id : ''));
    params.set('department_id', String(department_id > 0 ? department_id : ''));
    params.set('customer_type_id', String(customer_type_id> 0 ? customer_type_id: ''));
    if (synergy || synergy == 0)
      params.set('synergy', String(synergy));

    // make server call
    return this.get(url, new RequestOptions({search: params}));
  }

  /**
   * get all orders
   */
  orders_excel_download(month: number, year: number, role_id?: number, manager_id?: number, synergy?: number,
                        product_id?: number, brand_id?: number, zone_id?: number, department_id?: number): Observable<Response> {

    // prepare get params
    let params = new URLSearchParams();
    params.set('role_id', String(role_id > 0 ? role_id : ''));
    params.set('manager_id', String(manager_id > 0 ? manager_id : ''));
    params.set('product_id', String(product_id > 0 ? product_id : ''));
    params.set('brand_id', String(brand_id > 0 ? brand_id : ''));
    params.set('zone_id', String(zone_id > 0 ? zone_id : ''));
    params.set('department_id', String(department_id > 0 ? department_id : ''));
    if (synergy || synergy == 0)
      params.set('synergy', String(synergy));

    // get request with headers
    let content = this.addCredentials(new RequestOptions({
      responseType: ResponseContentType.Blob,
      search: params
    }));

    // make server call
    return this.http.get(this.getBaseUrl() + '/report/' + month + "/" + year + "/" + "excel/download", content);

  }

  /**
   * get all bricks user
   */
  excel_download(user_id: number, month: number, year: number, day?: number): Observable<Response> {

    // prepare get params
    let params = new URLSearchParams();
    params.set('date', String(day > 0 ? day : ''));

    // get request with headers
    let content = this.addCredentials(new RequestOptions({
      responseType: ResponseContentType.Blob,
      search: params
    }));

    // prepare url
    let url = this.getBaseUrl() + '/forUser/' + user_id + "/" + month + "/" + year;

    // make server call
    return this.http.get(url + '/excel/download', content);
  }

  /**
   * Get Order For Manager And CSE Sync
   *
   * @param month
   * @param year
   * @param role_id
   * @param manager_id
   * @param department_id
   * @returns {Observable<Result>}
   */
  area_manager_sync_orders(month: number, year: number, role_id?: number, manager_id?: number, department_id?: number): Observable<Result> {

    // prepare url
    let url = this.getBaseUrl() + "/area_manager/" + month + "/" + year;

    // prepare get params
    let params = new URLSearchParams();
    params.set('role_id', String(role_id > 0 ? role_id : ''));
    params.set('manager_id', String(manager_id > 0 ? manager_id : ''));
    params.set('department_id', String(department_id > 0 ? department_id : ''));


    // make server call
    return this.get(url, new RequestOptions({search: params}));
  }

  /**
   * Get Order For Manager And CSE Sync
   *
   * @param month
   * @param year
   * @param role_id
   * @param manager_id
   * @param department_id
   * @returns {Observable<Result>}
   */
  region_manager_sync_orders(month: number, year: number, role_id?: number, manager_id?: number, department_id?: number): Observable<Result> {

    // prepare url
    let url = this.getBaseUrl() + "/region_manager/" + month + "/" + year;

    // prepare get params
    let params = new URLSearchParams();
    params.set('role_id', String(role_id > 0 ? role_id : ''));
    params.set('manager_id', String(manager_id > 0 ? manager_id : ''));
    params.set('department_id', String(department_id > 0 ? department_id : ''));


    // make server call
    return this.get(url, new RequestOptions({search: params}));
  }

}
