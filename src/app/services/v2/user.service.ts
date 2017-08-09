import {Injectable} from "@angular/core";
import {Http, URLSearchParams, Response, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "../AuthService";
import {Result} from "../../models/result";
import {V2BaseService} from "./base.service";
@Injectable()
export class V2UserService extends V2BaseService {

    /**
     * model url
     *
     * @type {string}
     */
    protected modelUrl: string = 'users';

    /**
     * User Service constructor
     * @param http
     * @param _router
     * @param _authService
     */
    constructor(protected http: Http, protected _router: Router, protected _authService: AuthService) {
        super(http, _router, _authService);
    }

    /**
     * get children for user
     */
    all(role_id?: number, status?: boolean, region_id?: number, area_id?: number): Observable<Result> {

        // prepare url
        let url = this.getBaseUrl() + '/';

        // prepare get params
        let params = new URLSearchParams();
        params.set('role_id', String(role_id > 0 ? role_id : ''));
        params.set('status', String(status ? status : ''));
        params.set('region_id', String(region_id > 0 ? region_id : ''));
        params.set('area_id', String(area_id > 0 ? area_id : ''));

        // make server call
        return this.get(url, new RequestOptions({search: params}));
    }
}
