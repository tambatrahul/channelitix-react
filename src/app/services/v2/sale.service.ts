import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "../AuthService";
import {Result} from "../../models/result";
import {V2BaseService} from "./base.service";
import {User} from "../../models/user/user";
@Injectable()
export class SaleService extends V2BaseService {

  /**
   * model url
   *
   * @type {string}
   */
  protected modelUrl: string = 'sales';

  /**
   * Sales Service constructor
   * @param http
   * @param _router
   * @param _authService
   */
  constructor(protected http: Http, protected _router: Router, protected _authService: AuthService) {
    super(http, _router, _authService);
  }

  /**
   * get daily sales data for user
   */
  daily_sales(): Observable<Result> {

    // prepare url
    let url = this.getBaseUrl() + '/fetchDayWiseYearsPerformance/';

    // prepare get params
    let params = new URLSearchParams();
    // params.set('zone_id', String(zone_id > 0 ? zone_id : ''));
    // params.set('region_id', String(region_id > 0 ? region_id : ''));
    // params.set('area_id', String(area_id > 0 ? area_id : ''));

    // make server call
    return this.get(url, new RequestOptions({search: params}));
  }
}
