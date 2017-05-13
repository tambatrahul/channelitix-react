import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions} from "@angular/http";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Observable} from "rxjs";
import {Result} from "../models/result";
import {Visit} from "../models/visit/visit";

@Injectable()
export class VisitService extends BaseService {

    /**
     * model url
     *
     * @type {string}
     */
    protected modelUrl: string = 'visits';

    /**
     * Visit Service constructor
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
    monthlyVisits(month: number, year: number): Observable<Result> {

        // prepare url
        let url = this.getBaseUrl() + '/monthly/' + month + "/" + year;

        // make server call
        return this.get(url);
    }

    /**
     * get visit counts for user
     *
     * @param month
     * @param year
     * @param role_id
     * @param manager_id
     * @param synergy
     * @returns {Observable<Result>}
     */
    monthlyCountForChildren(month: number, year: number, role_id?: number, manager_id?: number, synergy?: number): Observable<Result> {

        // prepare url
        let url = this.getBaseUrl() + "/monthly/forChildren/" + month + "/" + year + "/count";

        // prepare get params
        let params = new URLSearchParams();
        params.set('role_id', String(role_id > 0 ? role_id : ''));
        params.set('manager_id', String(manager_id > 0 ? manager_id : ''));
        params.set('synergy', String(synergy ? synergy : ''));

        // make server call
        return this.get(url, new RequestOptions({search: params}));
    }

    /**
     * get visit Inputs
     */
    masters(): Observable<Result> {

        // prepare url
        let url = this.getBaseUrl() + '/masters';

        // make server call
        return this.get(url);
    }

    /**
     * customer select details
     *
     * @param date
     */
    for_date(date: string) {

        // prepare url
        let url = this.getBaseUrl() + '/forDate/' + date;

        // make post request
        return this.get(url);
    }

    /**
     *
     * Create Visit
     *
     * @param visit
     * @returns {Observable<Result>}
     */
    create(visit: Visit): Observable<Result> {

        // prepare url
        let url = this.getBaseUrl() + '/customer_inputs';

        // make server call
        return this.post(url, visit);
    }

    /**
     * customer select details
     *
     * @param customer_ids
     * @param date
     */
    customer_select(customer_ids: Array<number>, date: string) {

        // prepare url
        let url = this.getBaseUrl() + '/' + date + '/customer_select';

        // make post request
        return this.post(url, {'customer_ids': customer_ids});
    }
}
