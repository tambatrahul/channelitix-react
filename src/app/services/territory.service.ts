import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {BaseService} from "./base.service";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {Result} from "../models/result";

@Injectable()
export class TerritoryService extends BaseService {

    /**
     * model url
     *
     * @type {string}
     */
    protected modelUrl: string = 'territories';

    /**
     * Login Service constructor
     *
     * @param http
     * @param _router
     * @param _authService
     */
    constructor(protected http: Http, protected _router: Router, protected _authService: AuthService) {
        super(http, _router, _authService);
    }

    /**
     * get countries
     */
    public countries(): Observable<Result> {

        // make server call
        return this.get(this.getBaseUrl() + '/countries');
    }

    /**
     * get countries
     */
    public regions(country_id?: number): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        params.set('country_id', String(country_id > 0 ? country_id : ''));

        // make server call
        return this.get(this.getBaseUrl() + '/regions', new RequestOptions({search: params}));
    }

    /**
     * get regions
     */
    public area(region_id?: number, region_ids?: Array<number>): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        params.set('region_id', String(region_id > 0 ? region_id : ''));
        if (region_ids && region_ids.length > 0) {
            region_ids.map(function (region_id) {
                params.append('region_id[]', String(region_id));
            });
        }

        // make server call
        return this.get(this.getBaseUrl() + '/areas', new RequestOptions({search: params}));
    }

    /**
     * get headquarter for Area
     */
    public headquarter(area_id?: number, region_id?: number, area_ids?: Array<number>): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        params.set('area_id', String(area_id > 0 ? area_id : ''));
        params.set('region_id', String(region_id > 0 ? region_id : ''));

        if (area_ids && area_ids.length > 0) {
            area_ids.map(function (area_id) {
                params.append('area_id[]', String(area_id));
            });
        }

        // make server call
        return this.get(this.getBaseUrl() + '/headquarters', new RequestOptions({search: params}));
    }

    /**
     * get territories for Area
     */
    public territory(headquarter_id?: number): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));

        // make server call
        return this.get(this.getBaseUrl() + '/territories', new RequestOptions({search: params}));
    }

    /**
     * get brick for territory
     */
    public brick(territory_id?: number, headquarter_id?: number, user_ids?: Array<number>): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        params.set('territory_id', String(territory_id > 0 ? territory_id : ''));
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));

        if (user_ids && user_ids.length > 0) {
            user_ids.map(function (user_id) {
                params.append('user_id[]', String(user_id));
            });
        }

        // make server call
        return this.get(this.getBaseUrl() + '/bricks', new RequestOptions({search: params}));
    }
}
