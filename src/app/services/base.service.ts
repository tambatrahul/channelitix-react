import {Http, Response, Headers} from "@angular/http";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {Observable} from "rxjs";
import {Result} from "../models/result";
import {AppConstants} from "../app.constants";
import {User} from "../models/user/user";

export abstract class BaseService {

    /**
     * model url for server call
     *
     * @type {string}
     */
    protected abstract modelUrl: string;

    /**
     * logged in user
     */
    public user: User;

    /**
     * Auth Service constructor
     *
     * @param http
     * @param _router
     * @param _authService
     */
    constructor(protected http: Http, protected _router: Router, protected _authService: AuthService) {
    }

    /**
     * get base url
     * @returns {string}
     */
    public getBaseUrl() {
        return AppConstants.API_ENDPOINT + (this.modelUrl ? this.modelUrl : '')
    }

    /**
     * on permission denied error logout user
     *
     * @param response
     */
    public checkResponse(response: Response) {
        if (response.status == 403) {
            this.no_permission();
        }
    }

    /**
     * Actions to be performed when user is not permitted
     */
    public no_permission() {
        this._authService.logout();
        this._router.navigate(['/login']);
    }

    /**
     * get request on server
     *
     * @param url
     * @param options
     * @returns {Observable<Result>}
     */
    public get(url: string, options?: Object): Observable<Result> {
        return this.http.get(url, this.addCredentials(options))
            .map((res: Response) => {
                return res.json();
            }).catch((error: any) => {
                this.checkResponse(error);
                return Observable.throw(error.json().error || 'Server error')
            })
    }

    /**
     * Make post request
     */
    public post(url: string, data?: Object, options?: Object): Observable<Result> {
        return this.http.post(url, data, this.addCredentials(options))
            .map((res: Response) => {
                return res.json();
            })
            .catch((error: any) => {
                this.checkResponse(error);
                return Observable.throw(error.json() || 'Server error')
            });
    }

    /**
     * Make put request
     */
    public put(url: string, data?: Object, options?: Object): Observable<Result> {
        return this.http.put(url, data, this.addCredentials(options))
            .map((res: Response) => {
                return res.json();
            })
            .catch((error: any) => {
                this.checkResponse(error);
                return Observable.throw(error.json() || 'Server error')
            });
    }

    /**
     * add credentials
     *
     * @param options
     */
    public addCredentials(options?: Object) {
        let headers = new Headers();
        if (options) {
            if (this._authService.user) {
                headers.append('auth_token', this._authService.user.auth_token);
            }
        } else {
            options = {};
        }

        return options['headers'] = headers;
    }
}
