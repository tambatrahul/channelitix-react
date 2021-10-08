import {Injectable} from "@angular/core";
import {Http, RequestOptions, URLSearchParams} from '@angular/http';
import {Router} from "@angular/router";
import {AuthService} from "../AuthService";
import {V2BaseService} from "./base.service";
import {Observable} from "rxjs";
import {Result} from "../../models/result";

@Injectable()
export class V2ProductService extends V2BaseService {

  /**
   * model url
   *
   * @type {string}
   */
  protected modelUrl: string = 'portfolios';

  /**
   * Brand Service constructor
   *
   * @param http
   * @param _router
   * @param _authService
   */
  constructor(protected http: Http, protected _router: Router, protected _authService: AuthService) {
    super(http, _router, _authService);
  }

  /**
   *
   * @returns {Observable<Result>}
   */
  all(): Observable<Result> {
    // make server call
    return this.get(this.getBaseUrl() + '/' + 'names');
  }

  /**
   * get department brands
   */
  productPortfolioNames(department_id?: number): Observable<Result> {

    // prepare get params
    let params = new URLSearchParams();
    params.set('department_id', String(department_id > 0 ? department_id : ''));


    // make server call
    return this.get(this.getBaseUrl() + '/names', new RequestOptions({search: params}));
  }
}
