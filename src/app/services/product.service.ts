import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Observable} from "rxjs";
import {Result} from "../models/result";

@Injectable()
export class ProductService extends BaseService {

    /**
     * model url
     *
     * @type {string}
     */
    protected modelUrl: string = 'products';

    /**
     * Order Service constructor
     *
     * @param http
     * @param _router
     * @param _authService
     */
    constructor(protected http: Http, protected _router: Router, protected _authService: AuthService) {
        super(http, _router, _authService);
    }

    /**
     * get monthly report
     */
    all(): Observable<Result> {
        // make server call
        return this.get(this.getBaseUrl());
    }
}
