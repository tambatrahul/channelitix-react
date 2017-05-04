import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Result} from "../models/result";

@Injectable()
export class ReportService extends BaseService {

    /**
     * model url
     *
     * @type {string}
     */
    protected modelUrl: string = 'reports';

    /**
     * Report Service constructor
     *
     * @param http
     * @param _router
     * @param _authService
     */
    constructor(protected http: Http, protected _router: Router, protected _authService: AuthService) {
        super(http, _router, _authService);
    }

    /**
     * get all count for dashboard
     *
     * @returns {Observable<Result>}
     */
    counts(from_date, to_date, year): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        params.set('from_date', String(from_date ? from_date : ''));
        params.set('to_date', String(to_date ? to_date : ''));
        params.set('year', String(year > 0 ? year : ''));

        // make server call
        return this.get(this.getBaseUrl() + '/counts', new RequestOptions({search: params}));
    }

    /**
     * get all summary for user
     *
     * @returns {Observable<Result>}
     */
    summaryForUser(month: number, year: number, user_id: number): Observable<Result> {
        // prepare url
        let url = this.getBaseUrl() + '/summary/' + month + '/' + year + '/' + user_id;

        // make server call
        return this.get(url);
    }

    /**
     * get order and visit trends
     *
     * @returns {Observable<Result>}
     */
    visit_order_trend(from_date, to_date, year): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        params.set('from_date', String(from_date ? from_date : ''));
        params.set('to_date', String(to_date ? to_date : ''));
        params.set('year', String(year > 0 ? year : ''));

        // prepare url
        let url = this.getBaseUrl() + '/visit_order_trend/';

        // make server call
        return this.get(url, new RequestOptions({search: params}));
    }

    /**
     * get details till month
     * @returns {Observable<Result>}
     */
    till_month_chart(region_ids?: Array<number>, area_ids?: Array<number>, headquarter_ids?: Array<number>): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        if (headquarter_ids && headquarter_ids.length > 0) {
            headquarter_ids.map(function (h_id) {
                params.append('headquarter_id[]', String(h_id));
            });
        }
        if (area_ids && area_ids.length > 0) {
            area_ids.map(function (area_id) {
                params.append('area_id[]', String(area_id));
            });
        }
        if (region_ids && region_ids.length > 0) {
            region_ids.map(function (region_id) {
                params.append('region_id[]', String(region_id));
            });
        }

        // prepare url
        let url = this.getBaseUrl() + '/sap/till_month';

        // make server call
        return this.get(url, new RequestOptions({search: params}));
    }

    /**
     * get performance for year
     * @returns {Observable<Result>}
     */
    performance(year: number): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();

        // prepare url
        let url = this.getBaseUrl() + '/performance/' + year;

        // make server call
        return this.get(url, new RequestOptions({search: params}));
    }

    /**
     * get all product wise sale for dashboard
     *
     * @returns {Observable<Result>}
     */
    product_wise_sale(month, year): Observable<Result> {

        // make server call
        return this.get(this.getBaseUrl() + '/target_performance/' + month + '/' + year);
    }
}
