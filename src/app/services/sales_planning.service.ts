import {Injectable} from "@angular/core";
import {Http, RequestOptions, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Result} from "../models/result";
import {SecondarySale} from "../models/sale/secondary_sale";


@Injectable()
export class SalesPlanningService extends BaseService {

    /**
     * model url
     *
     * @type {string}
     */
    protected modelUrl: string = 'sales/planning';

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
     * @param headquarter_id
     * @returns {Observable<Result>}
     */
    monthly(month: number, year: number, headquarter_id?: number): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));

        return this.get(this.getBaseUrl() + '/monthly/' + month + "/" + year, new RequestOptions({search: params}));
    }
}
