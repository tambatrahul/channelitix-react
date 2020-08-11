import {Stockist} from './../models/download/stockist';
import {BrickDownload} from './../models/download/brick_download';
import { Injectable } from '@angular/core';
import {Http, RequestOptions, Response, ResponseContentType, URLSearchParams} from '@angular/http';
import {Observable} from "rxjs";
import {Router} from '@angular/router';
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Result} from "../models/result";

@Injectable()
export class DownloadService extends BaseService {

	 /**
     * model url
     *
     * @type {string}
     */
    protected modelUrl: string = 'download';

  	/**
     * Download Service constructor
     *
     * @param http
     * @param _router
     * @param _authService
     */
    constructor(protected http: Http, protected _router: Router, protected _authService: AuthService) {
        super(http, _router, _authService);
    }

    /**
     * get stockist report list
     */
    stockistReportLists() : Observable<Result> {
        // make server call
        return this.get(this.getBaseUrl() + '/stockistReportList');
    }

    /**
     * get brick working report list
     */
    brickReportLists() : Observable<Result> {
        // make server call
        return this.get(this.getBaseUrl() + '/brickReportList');
    }

    /**
     * get stockist report list
     */
    headquaterReportLists() : Observable<Result> {
        // make server call
        return this.get(this.getBaseUrl() + '/headquaterReportList');
    }

    /**
     * get brick working report list
     */
    primaryReportLists() : Observable<Result> {
        // make server call
        return this.get(this.getBaseUrl() + '/primaryReportList');
    }

    /**
     * download report
     */
    report_download(report_id?: number) {

        // prepare get params
        //let params = new URLSearchParams();
        //params.set('report_id', String(report_id > 0 ? report_id : ''));

        // make server call
        return this.getBaseUrl() + '/downloadreport?report_id=' + report_id;
    }
}