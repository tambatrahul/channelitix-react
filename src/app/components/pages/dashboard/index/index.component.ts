import {Component} from '@angular/core';
import * as moment from 'moment';
import {BaseComponent} from '../../../base/base.component';
import {ReportService} from '../../../../services/report.service';
import {AuthService} from '../../../../services/AuthService';

declare let jQuery: any;

@Component({
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.less']
})
export class DashBoardComponent extends BaseComponent {

  /**
   * dates
   *
   * @type {}
   */
  dates = {
    from_date: '',
    to_date: '',
    year: ''
  };

  /**
   * total visit and total pob
   * @type {number}
   */
  public total_visits: number = 0;
  public total_pob: number = 0;
  public total_pob_sk: number = 0;
  public total_pob_synergy: number = 0;
  public productive_calls: number = 0;

  /**
   * refresh button
   *
   * @type {boolean}
   */
  public refresh: boolean = false;

  /**
   * selected regions, areas and headquarters
   *
   * @type {Array}
   */
  public zone_ids: Array<number> = [];
  public region_ids: Array<number> = [];
  public area_ids: Array<number> = [];
  public headquarter_ids: Array<number> = [];

  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public year: number;

  /**
   * Dashboard Component Constructor
   */
  constructor(private reportService: ReportService, private _service: AuthService) {
    super();
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    this.month = moment().month();
    this.year = moment().year();
    if (this._service.user.hq_zone_id)
      this.zone_ids.push(this._service.user.hq_zone_id);
    if (this._service.user.hq_region_id)
      this.region_ids.push(this._service.user.hq_region_id);
    if (this._service.user.hq_area_id)
      this.area_ids.push(this._service.user.hq_area_id);
  }

  /**
   * On date change
   * @param dates
   */
  onDateChanged(dates) {
    this.dates = dates;
  }

  /**
   * total visit and pob values
   * @param data
   */
  totalVisitOrders(data) {
    this.total_visits = data.visits;
    this.total_pob = data.orders;
    this.total_pob_sk = data.orders_sk;
    this.total_pob_synergy = data.orders_synergy;
    this.productive_calls = (data.visits > 0) ? parseInt(((data.total_orders / data.visits) * 100).toFixed(2)) : 0
  }

  /**
   * zone selected action
   *
   * @param zone_ids
   */
  zoneSelected(zone_ids: Array<number>) {
    this.zone_ids = zone_ids;
    this.region_ids = [];
  }

  /**
   * region selected action
   *
   * @param region_ids
   */
  regionSelected(region_ids: Array<number>) {
    this.region_ids = region_ids;
    this.area_ids = [];
  }

  /**
   * Refresh Page
   */
  pageRefresh() {
    this.refresh = !this.refresh;
  }

  /**
   * area selected action
   *
   * @param area_ids
   */
  areaSelected(area_ids: Array<number>) {
    this.area_ids = area_ids;
    this.headquarter_ids = [];
  }

  /**
   * headquarter selected action
   *
   * @param headquarter_ids
   */
  headquarterSelected(headquarter_ids: Array<number>) {
    this.headquarter_ids = headquarter_ids;
  }
}
