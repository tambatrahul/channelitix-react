import {Injectable} from "@angular/core";
import {Http, RequestOptions, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Result} from "../models/result";


@Injectable()
export class PrimarySaleService extends BaseService {
    /**
     * model url
     *
     * @type {string}
     */
    protected modelUrl: string = 'sap';

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
     * monthly invoice
     *
     * @param month
     * @param year
     * @param region_id
     * @param area_id
     * @param headquarter_id
     * @param page
     * @returns {Observable<Result>}
     */
    monthly_invoice(month: number, year: number,
                    region_id?: number, area_id?: number, headquarter_id?: number, page?: number, zone_id?: number): Observable<Result> {

        // prepare url
        let url = this.getBaseUrl() + '/invoices/' + month + "/" + year;

        // prepare get params
        let params = new URLSearchParams();
        params.set('page', String(page > 0 ? page : ''));
        params.set('zone_id', String(zone_id > 0 ? zone_id : ''));
        params.set('region_id', String(region_id > 0 ? region_id : ''));
        params.set('area_id', String(area_id > 0 ? area_id : ''));
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));

        // make server call
        return this.get(url, new RequestOptions({search: params}));
    }

    /**
     * monthly product
     *
     * @param month
     * @param year
     * @param region_id
     * @param area_id
     * @param headquarter_id
     * @returns {Observable<Result>}
     */
    monthly_product(month: number, year: number, region_id?: number, area_id?: number, headquarter_id?: number
      , zone_id?: number): Observable<Result> {

        // prepare url
        let url = this.getBaseUrl() + '/invoices/product_wise/' + month + "/" + year;

        // prepare get params
        let params = new URLSearchParams();
        params.set('zone_id', String(zone_id > 0 ? zone_id : ''));
        params.set('region_id', String(region_id > 0 ? region_id : ''));
        params.set('area_id', String(area_id > 0 ? area_id : ''));
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));

        // make server call
        return this.get(url, new RequestOptions({search: params}));
    }

    /**
     * monthly stockist
     *
     * @param month
     * @param year
     * @param region_id
     * @param area_id
     * @param headquarter_id
     * @returns {Observable<Result>}
     */
    monthly_stockist(month: number, year: number,
                     region_id?: number, area_id?: number, headquarter_id?: number, zone_id?: number): Observable<Result> {

        // prepare url
        let url = this.getBaseUrl() + '/invoices/customer_wise/' + month + "/" + year;

        // prepare get params
        let params = new URLSearchParams();
        params.set('zone_id', String(zone_id > 0 ? zone_id : ''));
        params.set('region_id', String(region_id > 0 ? region_id : ''));
        params.set('area_id', String(area_id > 0 ? area_id : ''));
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));

        // make server call
        return this.get(url, new RequestOptions({search: params}));
    }
}
