import {Component, Input} from '@angular/core';
import {ReportService} from '../../../../services/report.service';
import {BaseAuthComponent} from '../../../base/base_auth.component';
import {AuthService} from '../../../../services/AuthService';
import {BaseDashboardComponent} from '../base_dashboard.component';
import {AppConstants} from '../../../../app.constants';
import {Headquarter} from '../../../../models/territory/headquarter';

declare let jQuery: any;

@Component({
  selector: 'dashboard-count',
  templateUrl: 'count.component.html',
  styleUrls: ['count.component.less'],
  inputs: ['refresh']
})
export class DashBoardCountComponent extends BaseDashboardComponent {

  /**
   * get all count
   *
   * @type {}
   */
  counts = {
    total_users: 0,
    total_active_users: 0,
    total_customers: 0,
    total_visits: 0,
    call_average: 0,
    performance_icon: 0,
    performance_chl: 0,
    productive_calls: 0,
    total_bricks: 0,
    total_headquarters: 0,
    performance_per: 0,
    skinlite_performance_per: 0
  };

  _productive_calls: number = 0;
  @Input()
  set productive_calls(productive_calls: number) {
    this._productive_calls = productive_calls;
  }

  _department_id: number = 0;
  @Input()
  set department_id(department_id: number) {
    this._department_id = department_id;
    this.fetchCounts();
  }

  /**
   * dates
   *
   * @type {}
   */
  _dates = {from_date: '', to_date: '', year: ''};
  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetchCounts();
  }

  /**
   * view quantity
   *
   * @type {number}
   * @private
   */
  _refresh: boolean;
  set refresh(refresh) {
    this._refresh = refresh;
    this.fetchCounts();
  }

  /**
   * zone id for filter
   */
  _zone_ids: Array<number> = [];
  @Input()
  set zone_ids(zone_ids) {
    this._zone_ids = zone_ids;
    this.fetchCounts();
  };

  /**
   * region id for filter
   */
  _region_ids: Array<number> = [];
  @Input()
  set region_ids(region_ids) {
    this._region_ids = region_ids;
    this.fetchCounts();
  };

  /**
   * area id for filter
   */
  _area_ids: Array<number> = [];
  @Input()
  set area_ids(area_ids) {
    this._area_ids = area_ids;
    this.fetchCounts();
  };

  /**
   * headquarter id for filter
   */
  _headquarter_ids: Array<number> = [];
  @Input()
  set headquarter_ids(headquarter_ids) {
    this._headquarter_ids = headquarter_ids;
    this.fetchCounts();
  };

  /**
   * Chart data
   */
  fetchCounts = AppConstants.debounce(function () {
    const self = this;
    self.loading = true;
    if (self._dates.year) {
      self.reportService.counts(self._dates.from_date, self._dates.to_date, self._dates.year,
        self._region_ids, self._area_ids, self._headquarter_ids, self._zone_ids, self._department_id).subscribe(
        response => {
          self.counts = response;
          self.loading = false;
        }, err => {
          self.loading = false;
        }
      );
    }
  }, 1000, false);

  /**
   * Dashboard Component Constructor
   */
  constructor(private reportService: ReportService, protected _authService: AuthService) {
    super(_authService);
  }

  /**
   * fetch counts from server
   */
  fetch() {

  }
}
