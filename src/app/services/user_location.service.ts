import {User} from "../models/user/user";
import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {BaseService} from "./base.service";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {Result} from "../models/result";

@Injectable()
export class UserLocationService extends BaseService {

  /**
   * model url
   *
   * @type {string}
   */
  protected modelUrl: string = 'user-locations';

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
   * get list of users
   *
   * @returns {Observable<Result>}
   */
  all(month_year: number): Observable<Result> {
    let url = this.getBaseUrl() + '/' + month_year;

    return this.get(url, new RequestOptions({}));
  }
}
