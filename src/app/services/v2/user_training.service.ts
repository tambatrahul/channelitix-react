import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "../AuthService";
import {Result} from "../../models/result";
import {V2BaseService} from "./base.service";
import {User} from "../../models/user/user";

@Injectable()
export class UserTrainingService extends V2BaseService {

  /**
   * model url
   *
   * @type {string}
   */
  protected modelUrl: string = 'getTrainings';

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
   * @returns {Observable<Result>}
   */
  fetch_user_trainings(): Observable<Result> {
      return this.get(this.getUserTrainingUrl());
  }

  trigger_user_trainings(body: any): Observable<Result> {
      return this.post(this.getUserTrainingUrl(), body);
  }

}
