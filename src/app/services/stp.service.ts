import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Result} from "../models/result";
import {Stp} from "../models/customer/stp";

@Injectable()
export class StpService extends BaseService {

    /**
     * model url
     *
     * @type {string}
     */
    protected modelUrl: string = 'stps';

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
     * get all stp for type
     *
     * @returns {Observable<Result>}
     */
    all(country_id?: number, region_id?: number, area_id?: number, headquarter_id?: number,
        territory_id?: number): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        params.set('hq_country_id', String(country_id > 0 ? country_id : ''));
        params.set('hq_region_id', String(region_id > 0 ? region_id : ''));
        params.set('hq_area_id', String(area_id > 0 ? area_id : ''));
        params.set('hq_headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));
        params.set('hq_territory_id', String(territory_id > 0 ? territory_id : ''));

        // make server call
        return this.get(this.getBaseUrl(), new RequestOptions({search: params}));
    }

    /**
     * Create new Customer
     */
    create(stps: Stp[]): Observable<Result> {
        return this.post(this.getBaseUrl(), {stps: stps});
    }
}
