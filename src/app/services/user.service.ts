import {User} from "./../models/user/user";
import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {BaseService} from "./base.service";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {Result} from "../models/result";

@Injectable()
export class UserService extends BaseService {

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
  children(role_id?: number, manager_id?: number, status?: string, search?: string): Observable<Result> {

    // prepare url
    let url = this.getBaseUrl() + '/children';

    // prepare get params
    let params = new URLSearchParams();
    params.set('role_id', String(role_id > 0 ? role_id : ''));
    params.set('manager_id', String(manager_id > 0 ? manager_id : ''));
    params.set('status', String(status ? status : ''));
    params.set('search', String((search && search.length > 0) ? search : ''));

    // make server call
    return this.get(url, new RequestOptions({search: params}));
  }

  /**
   * get list of managers for user
   *
   * @returns {Observable<Result>}
   */
  manager(): Observable<Result> {
    let url = this.getBaseUrl() + '/manager';

    return this.get(url, new RequestOptions({}));
  }

  /**
   * get list of users
   *
   * @returns {Observable<Result>}
   */
  all(): Observable<Result> {
    let url = this.getBaseUrl() + '/all';

    return this.get(url, new RequestOptions({}));
  }

  /**
   * Get User
   */
  read(id: number): Observable<Result> {
    return this.get(this.getBaseUrl() + '/' + id);
  }

  /**
   * Create new User
   */
  create(user: User): Observable<Result> {
    return this.post(this.getBaseUrl(), user)
  }

  /**
   * Update User
   */
  update(user: User, id: number): Observable<Result> {
    return this.put(this.getBaseUrl() + '/' + id, user)
  }

  /**
   * Deactivate user
   */
  deactivate(data, user_id): Observable<Result> {
    return this.put(this.getBaseUrl() + '/' + user_id + '/deactivate', data)
  }

  /**
   * Reset Password
   */
  reset_password(data, id): Observable<Result> {
    return this.put(this.getBaseUrl() + '/' + id + '/change_password', data)
  }

  /**
   * Reset Password
   */
  reset_user_password(data, id): Observable<Result> {
    return this.put(this.getBaseUrl() + '/' + id + '/reset_password', data)
  }
}
