import { User } from './../models/user/user';
import { Injectable } from "@angular/core";
import { Http, URLSearchParams, Response } from "@angular/http";
import { Observable } from "rxjs";
import { BaseService } from "./base.service";
import { Router } from "@angular/router";
import { AuthService } from "./AuthService";
import { Result } from "../models/result";

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
  children(role_id?: number, manager_id?: number): Observable<Result> {

    // prepare url
    let url = this.getBaseUrl() + '/children';

    // prepare get params
    let params = new URLSearchParams();
    params.set('role_id', String(role_id > 0 ? role_id : ''));
    params.set('manager_id', String(manager_id > 0 ? manager_id : ''));

      // make server call
      return this.http.get(url, {search: params, withCredentials: true})
          .map((res: Response) => {
              return res.json();
          })
          .catch((error: any) => {
              this.checkResponse(error);
              return Observable.throw(error.json().error || 'Server error')
          });
  }

  /**
   * Create new User
   */
  create(user: User) {
    return this.post(this.getBaseUrl(), user)
  }

    /**
     * Update User
     */
    update(user: User, id: number): Observable<Result> {
        return this.post(this.getBaseUrl(), user, id)
    }

    /**
     * Deactivate user
     */
    deactivate(data, user_id): Observable<Result> {
        return this.put(this.getBaseUrl(), data)
    }
}
