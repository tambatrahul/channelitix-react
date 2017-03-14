import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions} from "@angular/http";
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
        territory_id?: number, brick_id?: number): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        params.set('customer_type_id', String(customer_type_id > 0 ? customer_type_id : ''));
        params.set('grade_id', String(grade_id > 0 ? grade_id : ''));
        params.set('page', String(page > 0 ? page : ''));
        params.set('page', String(page > 0 ? page : ''));
        params.set('region_id', String(region_id > 0 ? region_id : ''));
        params.set('area_id', String(area_id > 0 ? area_id : ''));
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));
        params.set('territory_id', String(territory_id > 0 ? territory_id : ''));
        params.set('brick_id', String(brick_id > 0 ? brick_id : ''));

        // make server call
        return this.get(this.getBaseUrl(), new RequestOptions({search: params}));
    }

    /**
     * Standard tour program for user
     *
     * @returns {Observable<Result>}
     */
    stp(headquarter_id?: number) {
        // prepare get params
        let params = new URLSearchParams();
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));

        return this.get(this.getBaseUrl() + '/counts/stp', new RequestOptions({search: params}));
    }

    /**
     * customer counts with customer type
     *
     * @returns {Observable<Result>}
     */
    counts(): Observable<Result> {

        // make server call
        return this.get(this.getBaseUrl() + '/counts');
    }
}
