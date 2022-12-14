import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions} from "@angular/http";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Observable} from "rxjs";
import {Result} from "../models/result";

@Injectable()
export class ProductService extends BaseService {

    /**
     * model url
     *
     * @type {string}
     */
    protected modelUrl: string = 'products';

    /**
     * Order Service constructor
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
    all(abbott?: boolean): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        if (this.environment.envName == 'sk_group' && (abbott || abbott == false)) {
            params.set('synergy', String(abbott ? 1 : 0));
        }

        // make server call
        return this.get(this.getBaseUrl(), new RequestOptions({search: params}));
    }

  /**
   * get monthly report
   */
  allProduct(department_id?: number): Observable<Result> {

    // prepare get params
    let params = new URLSearchParams();
    params.set('department_id', String(department_id > 0 ? department_id : ''));


    // make server call
    return this.get(this.getBaseUrl(), new RequestOptions({search: params}));
  }
}
