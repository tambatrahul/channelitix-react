import {Stockist} from './../models/download/stockist';
import {BrickDownload} from './../models/download/brick_download';
import {HeadquaterDownload} from './../models/download/headquater_download';
import {PrimaryDownload} from './../models/download/primary_download';
import {InputReport} from './../models/download/input_report';
import {PriorityReport} from './../models/download/priority_report';
import {CustomerReport} from './../models/download/customer_report';
import {TargetReport} from './../models/download/target_report';
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
     * get headquater report list
     */
    headquaterReportLists() : Observable<Result> {
        // make server call
        return this.get(this.getBaseUrl() + '/headquaterReportList');
    }

    /**
     * get primary sales report list
     */
    primaryReportLists() : Observable<Result> {
        // make server call
        return this.get(this.getBaseUrl() + '/primaryReportList');
    }

    /**
     * get input utilization report list
     */
    inputReportLists() : Observable<Result> {
        // make server call
        return this.get(this.getBaseUrl() + '/inputReportList');
    }

    /**
     * get priority report list
     */
    priorityReportLists() : Observable<Result> {
        // make server call
        return this.get(this.getBaseUrl() + '/priorityReportList');
    }

    /**
     * get customer dump report list
     */
    customerReportLists() : Observable<Result> {
        // make server call
        return this.get(this.getBaseUrl() + '/customerReportList');
    }

    /**
     * get target dump report list
     */
    targetReportLists() : Observable<Result> {
        // make server call
        return this.get(this.getBaseUrl() + '/targetReportList');
    }

  /**
   * get primary sales report list
   */
  sampleReportLists() : Observable<Result> {
    // make server call
    return this.get(this.getBaseUrl() + '/sampleReportList');
  }

    /**
     * download report
     */
    report_download(report_id?: number, type?: number, month?: number, year?: number, zone_id?: number, region_id?: number, area_id?: number, headquater_id?: number, department_id?: number) {

       //generating url for download
        return this.getBaseUrl() + '/downloadreport?report_id=' + report_id + '&type=' + type + '&month=' + month + '&year=' + year + '&zone_id=' + zone_id + '&region_id=' + region_id + '&area_id=' + area_id + '&headquater_id=' + headquater_id + '&department_id=' + department_id;
    }

    downloadMonthlySalesReport(month?: number, year?: number, zone_id?: number, region_id?: number, area_id?: number, brand_id?: number, department_id?: number) {
      //generating url for download
      return this.getBaseUrl() + '/downloadMonthlyReport?month=' + month + '&year=' + year + '&zone_id=' + zone_id + '&region_id=' + region_id + '&area_id=' + area_id + '&brand_id' + brand_id + '&department_id=' + department_id;
    }
}
