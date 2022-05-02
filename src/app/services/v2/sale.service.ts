import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "../AuthService";
import {Result} from "../../models/result";
import {V2BaseService} from "./base.service";
import {User} from "../../models/user/user";
import {SecondarySale} from '../../models/sale/secondary_sale';
import {StockistSalesPlanning} from '../../models/sale/stockist_sales_planning';
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
  daily_sales(zone_id?: number, region_id?: number, area_id?: number, headquarter_id?: number, brand_id?: number): Observable<Result> {

    // prepare url
    let url = this.getBaseUrl() + '/fetchDayWiseYearsPerformance';

    // prepare get params
    let params = new URLSearchParams();
    params.set('zone_id', String(zone_id > 0 ? zone_id : ''));
    params.set('region_id', String(region_id > 0 ? region_id : ''));
    params.set('area_id', String(area_id > 0 ? area_id : ''));
    params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));
    params.set('brand_id', String(brand_id > 0 ? brand_id : ''));

    // make server call
    return this.get(url, new RequestOptions({search: params}));
  }

  /**
   * add entry to secondary sales
   *
   * @param sales_planning
   * @returns {Observable<Result>}
   */
  update_plan(sales_planning: StockistSalesPlanning[]) {
    // prepare url
    let url = this.getBaseUrl() + '/update-plan/';

    return this.post(url, {sales_planning: sales_planning});
  }
}
