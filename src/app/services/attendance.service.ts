import {Injectable} from "@angular/core";
import {Http, URLSearchParams, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Result} from "../models/result";


@Injectable()
export class AttendanceService extends BaseService {

  /**
   * model url
   *
   * @type {string}
   */
  protected modelUrl: string = 'attendances';

  /**
   * Attendance Service constructor
   *
   * @param http
   * @param _router
   * @param _authService
   */
  constructor(protected http: Http, protected _router: Router, protected _authService: AuthService) {
    super(http, _router, _authService);
  }

  /**
   * get attendance report
   */
  forChildren(month: number, year: number, role_id?: number, manager_id?: number): Observable<Result> {

    // prepare url
    let url = this.getBaseUrl() + '/monthly/forChildren/' + month + "/" + year;

    // prepare get params
    let params = new URLSearchParams();
    params.set('role_id', String(role_id > 0 ? role_id : ''));
    params.set('manager_id', String(manager_id > 0 ? manager_id : ''));

    // make server call
    return this.http.get(url, {search: params})
      .map((res: Response) => {
        return res.json();
      })
      .catch((error: any) => {
        this.checkResponse(error);
        return Observable.throw(error.json().error || 'Server error')
      });
  }
}
