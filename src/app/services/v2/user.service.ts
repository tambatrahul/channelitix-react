import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "../AuthService";
import {Result} from "../../models/result";
import {V2BaseService} from "./base.service";
import {User} from "../../models/user/user";
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
  all(role_id?: number, status?: string, zone_id?: number, region_id?: number, area_id?: number, page?: number, length?: number, search?: string): Observable<Result> {

    // prepare url
    let url = this.getBaseUrl();

    // prepare get params
    let params = new URLSearchParams();
    params.set('role_id', String(role_id > 0 ? role_id : ''));
    params.set('status', String(status ? status : ''));
    params.set('zone_id', String(zone_id > 0 ? zone_id : ''));
    params.set('region_id', String(region_id > 0 ? region_id : ''));
    params.set('area_id', String(area_id > 0 ? area_id : ''));
    params.set('page', String(page > 0 ? page : ''));
    params.set('length', String(length > 0 ? length : ''));
    params.set('search', String(search.length > 0 ? search : ''));

    // make server call
    return this.get(url, new RequestOptions({search: params}));
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
    return this.post(this.getBaseUrl(), user);
  }

  /**
   * Update User
   */
  update(user: User, id: number): Observable<Result> {
    return this.put(this.getBaseUrl() + '/' + id, user);
  }

  /**
   * Deactivate user
   */
  deactivate(data, user_id): Observable<Result> {
    return this.put(this.getBaseUrl() + '/' + user_id + '/deactivate', data);
  }

  /**
   * Reset Password
   */
  reset_password(data, id): Observable<Result> {
    return this.put(this.getBaseUrl() + '/' + id + '/change_password', data);
  }

  /**
   * Reset Password
   */
  report_delete(data, id): Observable<Result> {
    return this.put(this.getBaseUrl() + '/' + id + '/report_delete', data);
  }

  /**
   * Fetch user training forms location
   *
   * @param id
   */
  fetchUserTrainingForms(id): Observable<Result> {
    return this.get(this.getBaseUrl() + '/' + id + '/' + 'trainings/files');
  }
}
