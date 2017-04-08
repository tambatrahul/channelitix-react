import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions, ResponseContentType, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Result} from "../models/result";
import {Tour} from "../models/tour_program/tour";

@Injectable()
export class TourService extends BaseService {

    /**
     * model url
     *
     * @type {string}
     */
    protected modelUrl: string = 'tours';

    /**
     * Tour Service constructor
     *
     * @param http
     * @param _router
     * @param _authService
     */
    constructor(protected http: Http, protected _router: Router, protected _authService: AuthService) {
        super(http, _router, _authService);
    }

    /**
     * monthly tour
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
     * get tour report
     */
    forChildren(month: number, year: number, user_id: number, date?: number): Observable<Result> {

        // prepare url
        let url = this.getBaseUrl() + '/forUser/' + user_id + "/" + month + "/" + year;

        // prepare get params
        let params = new URLSearchParams();
        params.set('date', String(date > 0 ? date : ''));

        // make server call
        return this.get(url, new RequestOptions({search: params}));
    }

    /**
     * get tour counts for user
     *
     * @param month
     * @param year
     * @param role_id
     * @param manager_id
     * @returns {Observable<Result>}
     */
    monthlyCountForChildren(month: number, year: number, role_id?: number, manager_id?: number): Observable<Result> {

        // prepare url
        let url = this.getBaseUrl() + "/monthly/forChildren/" + month + "/" + year + "/count";

        // prepare get params
        let params = new URLSearchParams();
        params.set('role_id', String(role_id > 0 ? role_id : ''));
        params.set('manager_id', String(manager_id > 0 ? manager_id : ''));

        // make server call
        return this.get(url, new RequestOptions({search: params}));
    }

    /**
     * Create new tour
     *
     * @param tour
     */
    create(tour: Tour): Observable<Result> {
        return this.post(this.getBaseUrl(), tour);
    }

    /**
     * Delete Tour
     *
     * @param id
     */
    destroy(id: number): Observable<Result> {
        return this.remove(this.getBaseUrl() + '/' + id);
    }

    /**
     * monthly tour
     *
     * @param month
     * @param year
     * @param user_id
     * @returns {Observable<Result>}
     */
    tour_excel_download(month: number, year: number, user_id: number): Observable<Response> {

        // get request with headers
        let content = this.addCredentials(new RequestOptions({
            responseType: ResponseContentType.Blob
        }));

        // make server call
        return this.http.get(this.getBaseUrl() + '/excel/download/' + month + "/" + year + "/" + user_id, content);
    }
}
