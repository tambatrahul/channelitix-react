import {Injectable} from "@angular/core";
import {Http, RequestOptions, ResponseContentType, URLSearchParams, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Result} from "../models/result";
import {SecondarySale} from "../models/sale/secondary_sale";


@Injectable()
export class SecondarySaleService extends BaseService {

  /**
   * model url
   *
   * @type {string}
   */
  protected modelUrl: string = 'sales/secondary';

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
   * monthly attendance
   *
   * @param month
   * @param year
   * @returns {Observable<Result>}
   */
  hq_wise(month: number, year: number): Observable<Result> {

    // prepare url
    let url = this.getBaseUrl() + '/headquarter_wise/' + month + "/" + year;

    // make server call
    return this.get(url, new RequestOptions());
  }

  /**
   * for customer monthly attendance
   *
   * @param month
   * @param year
   * @param customer_id
   * @returns {Observable<Result>}
   */
  forCustomer(month: number, year: number, customer_id: number): Observable<Result> {

    // prepare url
    let url = this.getBaseUrl() + '/monthly/' + month + "/" + year + "/" + customer_id;

    // make server call
    return this.get(url, new RequestOptions());
  }

  /**
   * for hq monthly secondary sale
   *
   * @param month
   * @param year
   * @param hq_id
   * @param area_id
   * @param region_id
   * @returns {Observable<Result>}
   */
  product_wise(month: number, year: number, hq_id: number, area_id: number, region_id: number): Observable<Result> {

    // prepare get params
    let params = new URLSearchParams();
    params.set('headquarter_id', String(hq_id ? hq_id : ''));
    params.set('area_id', String(area_id ? area_id : ''));
    params.set('region_id', String(region_id ? region_id : ''));

    // prepare url
    let url = this.getBaseUrl() + '/product_wise/' + month + "/" + year;

    // make server call
    return this.get(url, new RequestOptions({search: params}));
  }

  /**
   * add entry to secondary sales
   *
   * @param secondary_sales
   * @param month
   * @param year
   * @param customer_id
   * @returns {Observable<Result>}
   */
  create(secondary_sales: SecondarySale[], month: number, year: number, customer_id: number) {
    // prepare url
    let url = this.getBaseUrl() + '/monthly/' + month + "/" + year + "/" + customer_id;

    return this.post(url, {secondary_sales: secondary_sales});
  }

  /**
   * monthly attendance
   *
   * @param month
   * @param year
   * @returns {Observable<Result>}
   */
  monthly_count(month: number, year: number): Observable<Result> {

    // prepare url
    let url = this.getBaseUrl() + '/monthly_count/' + month + "/" + year;

    // make server call
    return this.get(url, new RequestOptions());
  }

  /**
   * Missing Customers
   *
   * @param month
   * @param year
   * @param hq_id
   * @param area_id
   * @param region_id
   * @returns {Observable<Result>}
   */
  missing_customers(month: number, year: number, hq_id: number, area_id: number, region_id: number): Observable<Result> {

    // prepare get params
    let params = new URLSearchParams();
    params.set('headquarter_id', String(hq_id ? hq_id : ''));
    params.set('area_id', String(area_id ? area_id : ''));
    params.set('region_id', String(region_id ? region_id : ''));

    // prepare url
    let url = this.getBaseUrl() + '/missing_customer/' + month + "/" + year;

    // make server call
    return this.get(url, new RequestOptions({search: params}));
  }

  /**
   * for hq monthly secondary sale
   *
   * @param month
   * @param year
   * @param hq_id
   * @param area_id
   * @param region_id
   * @returns {Observable<Result>}
   */
  stockist_wise(month: number, year: number, hq_id: number, area_id: number, region_id: number): Observable<Result> {

    // prepare get params
    let params = new URLSearchParams();
    params.set('headquarter_id', String(hq_id ? hq_id : ''));
    params.set('area_id', String(area_id ? area_id : ''));
    params.set('region_id', String(region_id ? region_id : ''));

    // prepare url
    let url = this.getBaseUrl() + '/stockist_wise/' + month + "/" + year;

    // make server call
    return this.get(url, new RequestOptions({search: params}));
  }

  /**
   * brick wise customers
   */
  stockist_wise_excel_download(month: number, year: number, hq_id: number, area_id: number, region_id: number): Observable<Response> {

    // prepare get params
    let params = new URLSearchParams();
    params.set('headquarter_id', String(hq_id ? hq_id : ''));
    params.set('area_id', String(area_id ? area_id : ''));
    params.set('region_id', String(region_id ? region_id : ''));

    // get request with headers
    let content = this.addCredentials(new RequestOptions({
      responseType: ResponseContentType.Blob,
      search: params
    }));

    return this.http.get(this.getBaseUrl() + '/stockist_wise/' + month + "/" + year + "/excel_download", content);
  }

  /**
   *
   * @param {number} month
   * @param {number} year
   * @param {number} hq_id
   * @param {number} area_id
   * @param {number} region_id
   * @param {number} customer_id
   * @returns {Observable<Result>}
   */
  stockist_product_wise(month: number, year: number, hq_id: number, area_id: number, region_id: number, customer_id: number): Observable<Result> {

    // prepare get params
    let params = new URLSearchParams();
    params.set('headquarter_id', String(hq_id ? hq_id : ''));
    params.set('area_id', String(area_id ? area_id : ''));
    params.set('region_id', String(region_id ? region_id : ''));
    params.set('customer_id', String(customer_id ? customer_id : ''));

    // prepare url
    let url = this.getBaseUrl() + '/stockist_product_wise/' + month + "/" + year;

    // make server call
    return this.get(url, new RequestOptions({search: params}));
  }
}
