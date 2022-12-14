import {Customer} from './../models/customer/customer';
import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions, ResponseContentType, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Result} from "../models/result";

@Injectable()
export class CustomerService extends BaseService {

    /**
     * model url
     *
     * @type {string}
     */
    protected modelUrl: string = 'customers';

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
     * get all customer for user
     *
     * @returns {Observable<Result>}
     */
    all(customer_type_id?: number, grade_id?: number, page?: number,
        region_id?: number, area_id?: number, headquarter_id?: number,
        territory_id?: number, brick_id?: number, synergy?: number, zone_id?: number, approved_status?: string): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        params.set('customer_type_id', String(customer_type_id > 0 ? customer_type_id : ''));
        params.set('grade_id', String(grade_id > 0 ? grade_id : ''));
        params.set('page', String(page > 0 ? page : ''));
        params.set('region_id', String(region_id > 0 ? region_id : ''));
        params.set('area_id', String(area_id > 0 ? area_id : ''));
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));
        params.set('territory_id', String(territory_id > 0 ? territory_id : ''));
        params.set('brick_id', String(brick_id > 0 ? brick_id : ''));
        params.set('zone_id', String(zone_id > 0 ? zone_id : ''));
        params.set('synergy', String(synergy >= 0 ? synergy : ''));
        params.set('approved_status', String(approved_status ? approved_status : ''));

        // make server call
        return this.get(this.getBaseUrl(), new RequestOptions({search: params}));
    }

    /**
     * get all customer for user
     *
     * @returns {Observable<Result>}
     */
    forTypes(customer_type_id, synergy?: number, headquarter_id?: number): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        if (customer_type_id && Array.isArray(customer_type_id))
            customer_type_id.map(function (customer_type) {
                params.append('customer_type_id[]', String(customer_type));
            });
        else {
            params.set('customer_type_id', customer_type_id);
        }
        params.set('synergy', String(synergy));
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));

        // make server call
        return this.get(this.getBaseUrl(), new RequestOptions({search: params}));
    }

    /**
     * get all customer for bricks
     *
     * @returns {Observable<Result>}
     */
    forBricks(brick_ids: Array<number>): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        brick_ids.map(function (brick_id) {
            params.append('brick_ids[]', String(brick_id));
        });

        // make server call
        return this.get(this.getBaseUrl(), new RequestOptions({search: params}));
    }

    /**
     * get all customer for bricks
     *
     * @returns {Observable<Result>}
     */
    forDashboardCustomers(headquarter_ids: Array<number>, customer_type_id: number): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();

        params.append('headquarter_id', String(headquarter_ids));
        params.set('customer_type_id', String(customer_type_id > 0 ? customer_type_id : ''));

        // make server call
        return this.get(this.getBaseUrl(), new RequestOptions({search: params}));
    }

    /**
     * Standard tour program for user
     *
     * @returns {Observable<Result>}
     */
    stp(country_id?: number, zone_id?: number, region_id?: number, area_id?: number, headquarter_id?: number,
        territory_id?: number, brick_id?: number) {

        // prepare get params
        let params = new URLSearchParams();
        params.set('country_id', String(country_id > 0 ? country_id : ''));
        params.set('zone_id', String(zone_id > 0 ? zone_id : ''));
        params.set('region_id', String(region_id > 0 ? region_id : ''));
        params.set('area_id', String(area_id > 0 ? area_id : ''));
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));
        params.set('territory_id', String(territory_id > 0 ? territory_id : ''));
        params.set('brick_id', String(brick_id > 0 ? brick_id : ''));

        return this.get(this.getBaseUrl() + '/counts/stp', new RequestOptions({search: params}));
    }

    /**
     * customer counts with customer type
     *
     * @returns {Observable<Result>}
     */
    counts(region_id?: number, area_id?: number, headquarter_id?: number,
           territory_id?: number, brick_id?: number, zone_id?: number, approved_status?: string): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        params.set('zone_id', String(zone_id > 0 ? zone_id : ''));
        params.set('region_id', String(region_id > 0 ? region_id : ''));
        params.set('area_id', String(area_id > 0 ? area_id : ''));
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));
        params.set('territory_id', String(territory_id > 0 ? territory_id : ''));
        params.set('brick_id', String(brick_id > 0 ? brick_id : ''));
        params.set('approved_status', String(approved_status ? approved_status : ''));

      // make server call
        return this.get(this.getBaseUrl() + '/counts', new RequestOptions({search: params}));
    }

    /**
     * Get User
     */
    read(id: number): Observable<Result> {
        return this.get(this.getBaseUrl() + '/' + id);
    }

    /**
     * Create new Customer
     */
    create(customer: Customer): Observable<Result> {
        return this.post(this.getBaseUrl(), customer)
    }

    /**
     * Update Customer
     */
    update(customer: Customer, id: number): Observable<Result> {
        return this.put(this.getBaseUrl() + '/' + id, customer)
    }

    /**
     * Get Customer Type
     */
    masters(): Observable<Result> {
        return this.get(this.getBaseUrl() + '/masters');
    }

  /**
   * Deactivate brick
   */
  deactivate(brick_id): Observable<Result> {
    return this.post(this.getBaseUrl() + '/' + brick_id + '/deactivate');
  }

  /**
     * Deactivate brick
     */
    createTerritoryCustomer(id): Observable<Result> {
        return this.post(this.getBaseUrl() + '/' + id + '/add_to_EAPI');
    }

    /**
     * Activate brick
     */
    activate(brick_id): Observable<Result> {
        return this.post(this.getBaseUrl() + '/' + brick_id + '/activate');
    }

  /**
   * Approved customer
   */
  approveCustomer(id): Observable<Result> {
    return this.post(this.getBaseUrl() + '/' + id + '/approve-customer');
  }

  /**
   * Rejected customer
   */
  rejectedCustomer(id): Observable<Result> {
    return this.post(this.getBaseUrl() + '/' + id + '/reject-customer');
  }

    /**
     * get all bricks user
     */
    excel_download(region_id?: number, area_id?: number, headquarter_id?: number,
                   territory_id?: number, brick_id?: number): Observable<Response> {

        // prepare get params
        let params = new URLSearchParams();
        params.set('region_id', String(region_id > 0 ? region_id : ''));
        params.set('area_id', String(area_id > 0 ? area_id : ''));
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));
        params.set('territory_id', String(territory_id > 0 ? territory_id : ''));
        params.set('brick_id', String(brick_id > 0 ? brick_id : ''));

        // get request with headers
        let content = this.addCredentials(new RequestOptions({
            responseType: ResponseContentType.Blob,
            search: params
        }));

        // make server call
        return this.http.get(this.getBaseUrl() + '/excel/download', content);

    }

    /**
     * get details till month
     * @returns {Observable<Result>}
     */
    customer_missing(region_id?: number, area_id?: number, headquarter_id?: number,
                     month?: number, year?: number): Observable<Result> {


        // prepare get params
        let params = new URLSearchParams();
        params.append('region_id', String(region_id));
        params.append('area_id', String(area_id));
        params.append('headquarter_id', String(headquarter_id));

        // prepare url
        let url = this.getBaseUrl() + '/missing/brick_wise/' + month + '/' + year;

        // make server call
        return this.get(url, new RequestOptions({search: params}));
    }

    /**
     * Missing Customer Download
     *
     * @param region_id
     * @param area_id
     * @param headquarter_id
     * @param month
     * @param year
     * @returns {Observable<Response>}
     */
    customer_missing_download(region_id?: number, area_id?: number, headquarter_id?: number,
                              month?: number, year?: number):  Observable< Response> {
        // prepare get params
        let params = new URLSearchParams();
        params.append('region_id', String(region_id));
        params.append('area_id', String(area_id));
        params.append('headquarter_id', String(headquarter_id));

        // get request with headers
        let content = this.addCredentials(new RequestOptions({
            responseType: ResponseContentType.Blob,
            search: params
        }));

        return this.http.get(this.getBaseUrl() + '/missing/brick_wise/' + month + "/" + year + "/download", content);
    }
}
