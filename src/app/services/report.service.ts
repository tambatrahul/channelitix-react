import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Result} from "../models/result";
import {Stp} from "../models/customer/stp";

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
}
