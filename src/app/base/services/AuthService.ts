import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {AppConstants} from "../../app.constants";
import {User} from "../../models/user/user";
import {Router} from "@angular/router";
import {CookieService} from "angular2-cookie/services/cookies.service";

@Injectable()
export class AuthService {

  /**
   * base url for http request
   */
  protected baseUrl: string;

  /**
   * logged in user
   */
  public user: User;

  /**
   * auth Service constructor
   *
   * @param http
   * @param _router
   * @param _cookieService
   */
  constructor(public http: Http, public _router: Router, private _cookieService: CookieService) {
    this.baseUrl = AppConstants.API_ENDPOINT + 'auth';
    if (localStorage.getItem("user") !== null)
      this.user = JSON.parse(localStorage.getItem("user"));
  }

  /**
   * Check if the user is logged in or not
   * redirect to login page when user is not correct
   */
  checkCredentials() {
    if (localStorage.getItem("user") === null) {
      this._router.navigate(['/login']);
    }
  }

  /**
   * logout user
   */
  logout() {
    localStorage.setItem("user", null);
    this._cookieService.put('auth_token', '');
    this._router.navigate(['/login']);
  }
}
