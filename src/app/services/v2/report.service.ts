import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response, ResponseContentType, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { AuthService } from "../AuthService";
import { V2BaseService } from "./base.service";
import { Result } from "../../models/result";

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

    return this.get(this.getBaseUrl() + '/executive-summary/' + month + "/" + year, new RequestOptions({ search: params }));
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

    return this.get(this.getBaseUrl() + '/region-wise-sales/' + month + "/" + year, new RequestOptions({ search: params }));
  }

  /**
   * get milestone tracking sales
   * @returns {Observable<Result>}
   */
  milestone_sales_tracking_chart(region_ids?: Array<number>, area_ids?: Array<number>, headquarter_ids?: Array<number>,
    month?: number, year?: number, zone_ids?: Array<number>, department_id?: number): Observable<Result> {
    // prepare get params
    let params = new URLSearchParams();
    if (headquarter_ids && headquarter_ids.length > 0) {
      headquarter_ids.map(function (h_id) {
        params.append('headquarter_id[]', String(h_id));
      });
    }
    if (area_ids && area_ids.length > 0) {
      area_ids.map(function (area_id) {
        params.append('area_id[]', String(area_id));
      });
    }
    if (region_ids && region_ids.length > 0) {
      region_ids.map(function (region_id) {
        params.append('region_id[]', String(region_id));
      });
    }

    if (zone_ids && zone_ids.length > 0) {
      zone_ids.map(function (zone_id) {
        params.append('zone_id[]', String(zone_id));
      });
    }

    params.set('department_id', String(department_id > 0 ? department_id : ''));

    // prepare url
    let url = this.getBaseUrl() + '/milestone/summary/' + month + "/" + year;

    // make server call
    return this.get(url, new RequestOptions({ search: params }));
  }

  /**
   * get order and visit trends
   *
   * @returns {Observable<Result>}
   */
  visit_order_trend(month, year,
    region_ids?: Array<number>, area_ids?: Array<number>, headquarter_ids?: Array<number>,
    product_id?: number, brand_id?: number, zone_ids?: Array<number>, department_id?: number): Observable<Result> {

    // prepare get params
    let params = new URLSearchParams();
    params.set('product_id', String(product_id > 0 ? product_id : ''));
    params.set('brand_id', String(brand_id > 0 ? brand_id : ''));

    if (headquarter_ids && headquarter_ids.length > 0) {
      headquarter_ids.map(function (h_id) {
        params.append('headquarter_id[]', String(h_id));
      });
    }
    if (area_ids && area_ids.length > 0) {
      area_ids.map(function (area_id) {
        params.append('area_id[]', String(area_id));
      });
    }
    if (region_ids && region_ids.length > 0) {
      region_ids.map(function (region_id) {
        params.append('region_id[]', String(region_id));
      });
    }

    if (zone_ids && zone_ids.length > 0) {
      zone_ids.map(function (zone_id) {
        params.append('zone_id[]', String(zone_id));
      });
    }

    params.set('department_id', String(department_id > 0 ? department_id : ''));

    // prepare url
    let url = this.getBaseUrl() + '/visits/order-trend/' + month + '/' + year;

    // make server call
    return this.get(url, new RequestOptions({ search: params }));
  }

  /**
   * get all product wise sale for dashboard
   *
   * @returns {Observable<Result>}
   */
  product_wise_sale(month, year, region_ids?: Array<number>, area_ids?: Array<number>, headquarter_ids?: Array<number>,
    zone_ids?: Array<number>, department_id?: number): Observable<Result> {

    // prepare get params
    let params = new URLSearchParams();

    if (headquarter_ids && headquarter_ids.length > 0) {
      headquarter_ids.map(function (h_id) {
        params.append('headquarter_id[]', String(h_id));
      });
    }
    if (area_ids && area_ids.length > 0) {
      area_ids.map(function (area_id) {
        params.append('area_id[]', String(area_id));
      });
    }
    if (region_ids && region_ids.length > 0) {
      region_ids.map(function (region_id) {
        params.append('region_id[]', String(region_id));
      });
    }

    if (zone_ids && zone_ids.length > 0) {
      zone_ids.map(function (zone_id) {
        params.append('zone_id[]', String(zone_id));
      });
    }

    params.set('department_id', String(department_id > 0 ? department_id : ''))

    // make server call
    return this.get(this.getBaseUrl() + '/brand/performance/summary' + '/' + month + '/' + year, new RequestOptions({ search: params }));
  }

  /**
   * get order and visit trends
   *
   * @returns {Observable<Result>}
   */
  productivity_analysis(from_date, to_date, zone_id?: number, department_id?: number): Observable<Result> {

    // prepare get params
    let params = new URLSearchParams();
    params.set('from_date', String(from_date ? from_date : ''));
    params.set('to_date', String(to_date ? to_date : ''));
    params.set('zone_id', String(zone_id > 0 ? zone_id : ''));
    params.set('department_id', String(department_id > 0 ? department_id : ''));


    // prepare url
    let url = this.getBaseUrl() + '/productivity-analysis/summary';

    // make server call
    return this.get(url, new RequestOptions({ search: params }));
  }

  /**
   * get performance for last 15 months
   *
   * @returns {Observable<Result>}
   */
  performanceSummary(region_ids?: Array<number>,
    area_ids?: Array<number>, headquarter_ids?: Array<number>,
    zone_ids?: Array<number>, sub_name?: string, brand_id?: number, department_id?: number): Observable<Result> {

    // prepare get params
    let params = new URLSearchParams();
    params.set('brand_id', String(brand_id > 0 ? brand_id : ''));
    params.set('sub_name', sub_name);

    if (headquarter_ids && headquarter_ids.length > 0) {
      headquarter_ids.map(function (h_id) {
        params.append('headquarter_id[]', String(h_id));
      });
    }
    if (area_ids && area_ids.length > 0) {
      area_ids.map(function (area_id) {
        params.append('area_id[]', String(area_id));
      });
    }
    if (region_ids && region_ids.length > 0) {
      region_ids.map(function (region_id) {
        params.append('region_id[]', String(region_id));
      });
    }

    if (zone_ids && zone_ids.length > 0) {
      zone_ids.map(function (zone_id) {
        params.append('zone_id[]', String(zone_id));
      });
    }
    params.set('department_id', String(department_id > 0 ? department_id : ''));

    // prepare url
    let url = this.getBaseUrl() + '/performance/summary';

    // make server call
    return this.get(url, new RequestOptions({ search: params }));
  }

  /**
   * get details till month
   * @returns {Observable<Result>}
   */
  till_month_chart(region_ids?: Array<number>, area_ids?: Array<number>, headquarter_ids?: Array<number>,
    month?: number, year?: number, zone_ids?: Array<number>, department_id?: number): Observable<Result> {

    // prepare get params
    let params = new URLSearchParams();
    if (headquarter_ids && headquarter_ids.length > 0) {
      headquarter_ids.map(function (h_id) {
        params.append('headquarter_id[]', String(h_id));
      });
    }
    if (area_ids && area_ids.length > 0) {
      area_ids.map(function (area_id) {
        params.append('area_id[]', String(area_id));
      });
    }
    if (region_ids && region_ids.length > 0) {
      region_ids.map(function (region_id) {
        params.append('region_id[]', String(region_id));
      });
    }

    if (zone_ids && zone_ids.length > 0) {
      zone_ids.map(function (zone_id) {
        params.append('zone_id[]', String(zone_id));
      });
    }
    if (month)
      params.append('month', String(month));
    if (year)
      params.append('year', String(year));

    params.set('department_id', String(department_id > 0 ? department_id : ''));


    // prepare url
    let url = this.getBaseUrl() + '/ytd/performance/summary' + '/' + month + '/' + year;

    // make server call
    return this.get(url, new RequestOptions({ search: params }));
  }

  /**
   * Reponse for counts component
   * 
   * @param month
   * @param year
   * @param zoneIds
   * @param regionIds
   * @param areaIds
   * @param headquarterIds
   * @param departmentIds
   * 
   * @returns {Observable<Result>}
   */
  totalSummary(month, year, zoneIds?: Array<number>, regionIds?: Array<number>, areaIds?: Array<number>,
    headquarterIds?: Array<number>, departmentId?: number): Observable<Result> {

    let params = new URLSearchParams();

    params.set('month', String(month > 0 ? month : ''));
    params.set('year', String(year > 0 ? year : ''));
    params.set('department_id', String(departmentId > 0 ? departmentId : ''));

    if (zoneIds && zoneIds.length > 0) {
      zoneIds.map(function (zoneId) {
        params.append('zone_id[]', String(zoneId));
      });
    }

    if (regionIds && regionIds.length > 0) {
      regionIds.map(function (regionId) {
        params.append('region_id[]', String(regionId));
      });
    }

    if (areaIds && areaIds.length > 0) {
      areaIds.map(function (areaId) {
        params.append('area_id[]', String(areaId));
      });
    }

    if (headquarterIds && headquarterIds.length > 0) {
      headquarterIds.map(function (headquarterId) {
        params.append('headquarter_id[]', String(headquarterId));
      });
    }

    return this.get(this.getBaseUrl() + '/summary' + '/' + month + '/' + year, new RequestOptions({ search: params }));
  }
}
