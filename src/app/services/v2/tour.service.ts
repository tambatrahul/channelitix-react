import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions, ResponseContentType, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "../AuthService";
import {V2BaseService} from "./base.service";
import {Result} from "../../models/result";
import {Tour} from "../../models/tour_program/tour";

@Injectable()
export class V2TourService extends V2BaseService {

  /**
   * model url
   *
   * @type {string}
   */
  protected modelUrl: string = 'tours';

  /**
   * Tour Service constructor
   *
   * @param http
   * @param _router
   * @param _authService
   */
  constructor(protected http: Http, protected _router: Router, protected _authService: AuthService) {
    super(http, _router, _authService);
  }

  /**
   * Fetch all tour program count
   *
   * @param month
   * @param year
   * @param country_id
   * @param zone_id
   * @param region_id
   * @param area_id
   */
  tour_program_report_excel_download(month: number, year: number, country_id?: number, zone_id?: number, region_id?: number, area_id?: number): Observable<Response> {

    let params = new URLSearchParams();
    params.set('country_id', String(country_id > 0 ? country_id : ''));
    params.set('zone_id', String(zone_id > 0 ? zone_id : ''));
    params.set('region_id', String(region_id > 0 ? region_id : ''));
    params.set('area_id', String(area_id > 0 ? area_id : ''));

    let content = this.addCredentials(new RequestOptions({
      responseType: ResponseContentType.Blob,
      search: params
    }));

    return this.http.get(this.getBaseUrl() + '/tour-program-report-download/' + month + '/' + year, content);

  }
}
