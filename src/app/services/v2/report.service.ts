import {Injectable} from "@angular/core";
import {Http, RequestOptions, Response, ResponseContentType, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "../AuthService";
import {V2BaseService} from "./base.service";
import {Result} from "../../models/result";

@Injectable()
export class V2ReportService extends V2BaseService {

    /**
   * model url
   *
   * @type {string}
   */
  protected modelUrl: string = 'reports';

  /**
   * Report Service constructor
   *
   * @param http
   * @param _router
   * @param _authService
   */
   constructor(protected http: Http, protected _router: Router, protected _authService: AuthService) {
    super(http, _router, _authService);
  }

  /**
   * executive summary report api
   */
   executive_summary(month: number, year: number, zone_id?: number, department_id?: number) {

    // prepare get params
    let params = new URLSearchParams();
    params.set('zone_id', String(zone_id > 0 ? zone_id : ''));
    params.set('department_id', String(department_id > 0 ? department_id : ''));

    return this.get(this.getBaseUrl() + '/executive-summary/' + month + "/" + year, new RequestOptions({search: params}));
  }

  /**
   * Monthly Headquarter wise sales report API
   */
   region_wise_sales(month: number, year: number, region_id?: number, area_id?: number, headquarter_id?: number, zone_id?: number, department_id?: number) {

    // prepare get params
    let params = new URLSearchParams();
    params.set('zone_id', String(zone_id > 0 ? zone_id : ''));
    params.set('region_id', String(region_id > 0 ? region_id : ''));
    params.set('area_id', String(area_id > 0 ? area_id : ''));
    params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));
    params.set('department_id', String(department_id > 0 ? department_id : ''));

    return this.get(this.getBaseUrl() + '/region-wise-sales/' + month + "/" + year, new RequestOptions({search: params}));
  }
  
}