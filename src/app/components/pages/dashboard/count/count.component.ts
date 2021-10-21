import { Component, Input } from '@angular/core';
import { BaseAuthComponent } from '../../../base/base_auth.component';
import { AuthService } from '../../../../services/AuthService';
import { BaseDashboardComponent } from '../base_dashboard.component';
import { AppConstants } from '../../../../app.constants';
import { Headquarter } from '../../../../models/territory/headquarter';
import { V2ReportService } from 'app/services/v2/report.service';
import { Summary } from 'app/models/V2/SAP/summary';
import { setFlagsFromString } from 'v8';
import { constants } from 'os';

declare let jQuery: any;

@Component({
  selector: 'dashboard-count',
  templateUrl: 'count.component.html',
  styleUrls: ['count.component.less'],
  inputs: ['refresh']
})
export class DashBoardCountComponent extends BaseDashboardComponent {

  public totalPrimarySalesAndTarget: Summary[];
  public pobSummary: Summary[];

  /**
   * find totals
   *
   * @type {}
   */
  summary = {
    total_headquarters: 0,
    total_bricks: 0,
    total_cses: 0,
    total_customers: 0,
    total_field_working_days: 0,
    total_visits: 0,
    total_orders: 0,
    call_average: 0,
    iconGrowth: 0,
    iconAchievement: 0,
    chlGrowth: 0,
    chlAchievement: 0,
    growth: 0,
    achievement: 0,
    iconProductiveCalls: 0,
    chlProductiveCalls: 0,
    productiveCalls: 0
  };

  /**
   * year and month for calendar
   * @type {number}
   */
  public _month: number;
  public _year: number;

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


  @Input()
  set month(month: number) {
    this._month = month;
    this.fetchCounts();
  }

  @Input()
  set year(year: number) {
    this._year = year;
    this.fetchCounts();
  }

  /**
   * dates
   *
   * @type {}
   */
  _dates = { from_date: '', to_date: '', year: '' };
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
    if ((self._month == 0 || self._month >= 0) && self._year) {
      self.reportService.totalSummary(self._month + 1, self._year, self._zone_ids,
        self._region_ids, self._area_ids, self._headquarter_ids, self._department_id).subscribe(
          response => {
            self.summary = response;
            self.totalPrimarySalesAndTarget = response.total_primary_sales_and_target.map(tpst => new Summary(tpst));
            self.pobSummary = response.total_pob.map(pob => new Summary(pob));
            self.formateData(self.totalPrimarySalesAndTarget, self.pobSummary);
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
  constructor(private reportService: V2ReportService, protected _authService: AuthService) {
    super(_authService);
  }

  /**
   * fetch counts from server
   */
  fetch() {

  }

  /**
   * 
   */
  formateData(totalPrimarySalesAndTarget: Summary[], pobSummary: Summary[]) {

    const self = this;

    self.totalPrimarySalesAndTarget.map(s => {
      if (s.department == AppConstants.ICON_DEPARTMENT) {
        self.summary.iconGrowth = s.growth;
        self.summary.iconAchievement = s.achievement;
      }

      if (s.department == AppConstants.CHL_DEPARTMENT) {
        self.summary.chlGrowth = s.growth;
        self.summary.chlAchievement = s.achievement;
      }

      if (s.department != AppConstants.CHL_DEPARTMENT && s.department != AppConstants.ICON_DEPARTMENT) {
        self.summary.growth = s.growth;
        self.summary.achievement = s.achievement;
      }
    });

    self.pobSummary.map(pob => {
      if (pob.department == AppConstants.ICON_DEPARTMENT) {
        self.summary.iconProductiveCalls = pob.productiveCalls;
      }

      if (pob.department == AppConstants.CHL_DEPARTMENT) {
        self.summary.chlProductiveCalls = pob.productiveCalls;
      }

      if (pob.department != AppConstants.CHL_DEPARTMENT && pob.department != AppConstants.ICON_DEPARTMENT) {
        self.summary.productiveCalls = pob.productiveCalls;
      }
    });
  }
}
