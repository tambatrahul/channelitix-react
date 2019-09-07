import {Component, ViewChild, ElementRef} from '@angular/core';
import * as moment from 'moment';
import {AuthService} from '../../../../services/AuthService';
import {ListComponent} from '../../../base/list.component';
import {PrimarySaleService} from '../../../../services/primary_sale.service';
import {InvoiceDetail} from '../../../../models/SAP/invoice_detail';

declare let jQuery: any;

@Component({
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.less']
})
export class PrimarySaleComponent extends ListComponent {

  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public year: number;

  /**
   * region, area & headquarter
   */
  public zone_id: number = 0;
  public region_id: number = 0;
  public area_id: number = 0;
  public headquarter_id: number = 0;

  /**
   * get title of table
   * @returns {string}
   */
  get title(): string {
    return moment().year(this.year).month(this.month).format('MMMM, YYYY');
  }

  /**
   * invoice detail
   *
   * @type {Array}
   */
  public invoice_details: InvoiceDetail[] = [];

  /**
   * User Component Constructor
   *
   */
  constructor(private saleService: PrimarySaleService, public _service: AuthService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    this.month = moment().month();
    this.year = moment().year();

    if (this._service.user.role_id == 4) {
      this.region_id = this._service.user.hq_region_id;
      this.area_id = this._service.user.hq_area_id;
    }
    if (this._service.user.role_id == 5) {
      this.region_id = this._service.user.hq_region_id;
    }
    if (this._service.user.role_id == 6) {
      this.zone_id = this._service.user.hq_zone_id;
    }

    if (this._service.user.role_id == 7) {
      this.zone_id = 1;
    }

    super.ngOnInit();
  }

  /**
   * fetch customer secondary sales from server
   */
  fetch() {
  }

  /**
   * month and year changed
   *
   * @param date
   */
  monthYearChanged(date) {
    this.month = date.month;
    this.year = date.year;
  }

  /**
   * when region is changed filter list of customer
   * @param zone_id
   */
  zoneChanged(zone_id) {
    this.zone_id = zone_id;
    this.regionChanged(0);
  }

  /**
   * when region is changed filter list of customer
   * @param region_id
   */
  regionChanged(region_id) {
    this.region_id = region_id;
    this.areaChanged(0);
  }

  /**
   * when area is changed filter list of customer
   * @param area_id
   */
  areaChanged(area_id) {
    this.area_id = area_id;
    this.headquarterChanged(0);
  }

  /**
   * when headquarter is changed filter list of customer
   * @param headquarter_id
   */
  headquarterChanged(headquarter_id) {
    this.headquarter_id = headquarter_id;
  }
}
