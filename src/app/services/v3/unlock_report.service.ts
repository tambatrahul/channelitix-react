import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "../AuthService";
import {Result} from "../../models/result";
import {V3BaseService} from "./base.service";
import {User} from "../../models/user/user";

@Injectable()
export class UnlockReportService extends V3BaseService {

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

  unlockReportingforUser(userId: number): Observable<Result> {

    let url = this.getBaseUrl() + "/" + userId + "/unlock";
    return this.put(url);

  }

}
