import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions, ResponseContentType, Response} from "@angular/http";
import {Observable} from "rxjs";
import {BaseService} from "./base.service";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {Result} from "../models/result";
import {Brick} from "../models/territory/brick";

@Injectable()
export class BrickService extends BaseService {

    /**
     * model url
     *
     * @type {string}
     */
    protected modelUrl: string = 'bricks';

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
     * get all bricks user
     */
    bricks(territory_id?: number): Observable<Result> {

        // prepare url
        let url = this.getBaseUrl();

        // prepare get params
        let params = new URLSearchParams();
        params.set('territory_id', String(territory_id > 0 ? territory_id : ''));

        // make server call
        return this.get(url, new RequestOptions({search: params}));
    }

    /**
     * Get User
     */
    read(id: number): Observable<Result> {
        return this.get(this.getBaseUrl() + '/' + id);
    }

    /**
     * Create new brick
     */
    create(brick: Brick): Observable<Result> {
        return this.post(this.getBaseUrl(), brick)
    }

    /**
     * Update Brick
     */
    update(brick: Brick, id: number): Observable<Result> {
        return this.put(this.getBaseUrl() + '/' + id, brick)
    }

    /**
     * get all bricks user
     */
    brick_excel_download(): Observable<Response> {


        // get request with headers
        let content = this.addCredentials(new RequestOptions({
            responseType: ResponseContentType.Blob
        }));

        // make server call
        return this.http.get(this.getBaseUrl() + '/excel/download', content);

    }
}
