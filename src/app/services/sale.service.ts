import {Injectable} from "@angular/core";
import {Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Result} from "../models/result";


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
}
