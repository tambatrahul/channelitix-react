import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Result} from "../models/result";

@Injectable()
export class LoginService extends BaseService {

  /**
   * model url
   *
   * @type {string}
   */
  protected modelUrl: string = 'auth';

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
   * get children for user
   */
  login(username: string, password: string): Observable<Result> {

    // make server call
    return this.post(this.getBaseUrl() + '/login', {username: username, password: password});
  }

  /**
   * get user for token
   */
  forToken(token: number): Observable<Result> {

    // make server call
    return this.http.get(this.getBaseUrl() + '/forToken/' + token)
      .map((res: Response) => {
        return res.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  user_data(): Observable<Result> {
    return this.get(this.getBaseUrl() + '/getUser');
  }
}
