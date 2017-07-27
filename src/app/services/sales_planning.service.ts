import {Injectable} from "@angular/core";
import {Http, RequestOptions, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Result} from "../models/result";
import {SecondarySale} from "../models/sale/secondary_sale";
import {Customer} from "../models/customer/customer";


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
     * @returns {Observable<Result>}
     */
    monthly(month: number, year: number): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();

        return this.get(this.getBaseUrl() + '/monthly/' + month + "/" + year, new RequestOptions({search: params}));
    }

    /**
     * Save Data
     *
     * @param customers
     * @param month
     * @param year
     * @param status
     * @returns {Observable<Result>}
     */
    save(customers: Customer[], month: number, year: number, status : string) {
        // prepare url
        let url = this.getBaseUrl() + '/monthly/' + month + "/" + year + "/" + status;

        return this.post(url, {customers: customers});
    }
}
