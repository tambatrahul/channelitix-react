import {Stockist} from './../models/download/stockist';
import {BrickDownload} from './../models/download/brick_download';
import {HeadquaterDownload} from './../models/download/headquater_download';
import {PrimaryDownload} from './../models/download/primary_download';
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
    report_download(report_id?: number, type?: number, month?: number, year?: number, headquater_id?: number) {

       //generating url for download
        return this.getBaseUrl() + '/downloadreport?report_id=' + report_id + '&type=' + type + '&month=' + month + '&year=' + year + '&headquater_id=' + headquater_id;
    }
}