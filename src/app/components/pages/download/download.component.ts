import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {BaseAuthComponent} from '../../base/base_auth.component';
import {AuthService} from '../../../services/AuthService';
import {DownloadService} from '../../../services/download.service';
import {Stockist} from '../../../models/download/stockist';
import {BrickDownload} from '../../../models/download/brick_download';
import {HeadquaterDownload} from '../../../models/download/headquater_download';
import {PrimaryDownload} from '../../../models/download/primary_download';
import {InputReport} from '../../../models/download/input_report';
import {PriorityReport} from '../../../models/download/priority_report';
import {Download} from '../../../models/download/download';

declare let jQuery: any;
declare let swal: any;

@Component({
  //selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.less']
})
export class DownloadComponent extends BaseAuthComponent {

  /**
   * stockist reports
   *
   * @type {{}}
   */
  public stockists: Stockist[];
  public brick_downloads: BrickDownload[];
  public headquater_downloads: HeadquaterDownload[];
  public primary_downloads: PrimaryDownload[];
  public input_reports: InputReport[];
  public priority_reports: PriorityReport[];
  public download: Download;


  /** 
   * report id
   */
  public stockist_report_id: number = 0;
  public brick_report_id: number = 0;
  public headquater_report_id: number = 0;
  public primary_report_id: number = 0;
  public input_report_id: number = 0;
  public priority_report_id: number = 0;
  public report_id: number = 0;

  btn_loading: boolean = false;

  constructor(private downloadService: DownloadService, public _router: Router, public _service: AuthService, public route: ActivatedRoute) {
  	super(_service);
  }

  ngOnInit() {
  	super.ngOnInit();
  }

  /**
   * get stockist report id to download
   */
  stockistReportChanged(stockist_report_id) {
    this.report_id = stockist_report_id;
  }

  /**
   * get brick report id to download
   */
  brickReportChanged(brick_report_id) {
    this.report_id = brick_report_id;
  }

  /**
   * get headquater report id to download
   */
  headquaterReportChanged(headquater_report_id) {
    this.report_id = headquater_report_id;
  }

  /**
   * get primary report id to download
   */
  primaryReportChanged(primary_report_id) {
    this.report_id = primary_report_id;
  }

  /**
   * get input report id to download
   */
  inputReportChanged(input_report_id) {
    this.report_id = input_report_id;
  }

  /**
   * get priority report id to download
   */
  priorityReportChanged(priority_report_id) {
    this.report_id = priority_report_id;
  }

  /**
   * Download Excel For Report
   */
  report_download() {
    let url = this.downloadService.report_download(this.report_id);
    window.open(url, "_blank");
  }
}