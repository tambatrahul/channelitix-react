import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Result} from "../../models/result";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";

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
    return this.http.post(this.baseUrl + '/login', {username: username, password: password}, {withCredentials: true})
      .map((res: Response) => {
        return res.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  /**
   * get user for token
   */
  forToken(token: number): Observable<Result> {

    // make server call
    return this.http.get(this.baseUrl + '/forToken/' + token)
      .map((res: Response) => {
        return res.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
