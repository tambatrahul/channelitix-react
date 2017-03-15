import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
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
    bricks(): Observable<Result> {

        // prepare url
        let url = this.getBaseUrl();

        // make server call
        return this.get(url);
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
}
