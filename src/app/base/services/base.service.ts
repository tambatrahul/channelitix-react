import {Http, Response} from "@angular/http";
import {User} from "../../models/user/user";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {AppConstants} from "../../app.constants";

export abstract class BaseService {

  /**
   * base url for http request
   *
   * @type {string}
   */
  protected baseUrl: string;

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
   * auth Service constructor
   *
   * @param http
   * @param _router
   * @param _authService
   */
  constructor(protected http: Http, protected _router: Router, protected _authService: AuthService) {
    this.baseUrl = AppConstants.API_ENDPOINT + this.modelUrl;
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


}
