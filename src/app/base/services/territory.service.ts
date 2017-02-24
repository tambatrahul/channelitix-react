import {Injectable} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {Result} from "../../models/result";
import {BaseService} from "./base.service";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";

@Injectable()
export class TerritoryService extends BaseService {

  /**
   * model url
   *
   * @type {string}
   */
  protected modelUrl: string = 'territories';

  /**
   * Login Service constructor
   *
   * @param http
   * @param _router
   * @param _authService
   */
  constructor(protected http: Http, protected _router: Router, protected _authService: AuthService) {
    super(http, _router, _authService);
  }

  /**
   * get countries
   */
  public countries(): Observable<Result> {

    // make server call
    return this.get(this.getBaseUrl() + '/countries');
  }

  /**
   * get countries
   */
  public regions(country_id?: number): Observable<Result> {

    // prepare get params
    let params = new URLSearchParams();
    params.set('country_id', String(country_id > 0 ? country_id : ''));

    // make server call
    return this.get(this.getBaseUrl() + '/regions', {search: params});
  }

  /**
   * get regions
   */
  public area(region_id?: number): Observable<Result> {

    // prepare get params
    let params = new URLSearchParams();
    params.set('region_id', String(region_id > 0 ? region_id : ''));

    // make server call
    return this.get(this.getBaseUrl() + '/areas', {search: params});
  }

  /**
   * get territories for Area
   */
  public territory(area_id?: number): Observable<Result> {

    // prepare get params
    let params = new URLSearchParams();
    params.set('area_id', String(area_id > 0 ? area_id : ''));

    // make server call
    return this.get(this.getBaseUrl() + '/territories', {search: params});
  }

  /**
   * get headquarter for territory
   */
  public headquarter(territory_id?: number): Observable<Result> {

    // prepare get params
    let params = new URLSearchParams();
    params.set('territory_id', String(territory_id > 0 ? territory_id : ''));

    // make server call
    return this.get(this.getBaseUrl() + '/headquarters', {search: params});
  }

  /**
   * get brick for headquarter
   */
  public brick(headquarter_id?: number): Observable<Result> {

    // prepare get params
    let params = new URLSearchParams();
    params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));

    // make server call
    return this.get(this.getBaseUrl() + '/bricks', {search: params});
  }
}
