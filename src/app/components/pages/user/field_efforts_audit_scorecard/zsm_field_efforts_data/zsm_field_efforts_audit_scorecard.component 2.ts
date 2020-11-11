import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ListComponent} from "../../../../base/list.component";
import {ReportService} from "../../../../../services/report.service";
import {AuthService} from "../../../../../services/AuthService";
import {Region} from "../../../../../models/territory/region";
import {Attendance} from "../../../../../models/attendance/attendance";
import {Visit} from "../../../../../models/visit/visit";
import {Observable} from "rxjs/Observable";
import {Order} from "../../../../../models/order/order";

@Component({
  selector: '[zsm-field-efforts-audit-scorecard]',
  styleUrls: ['zsm_field_efforts_audit_scorecard.component.less'],
  templateUrl: 'zsm_field_efforts_audit_scorecard.component.html'
})
export class ZSMFieldEffortsAuditScorecard extends ListComponent {
  /**
   * month of sales
   */
  public _month: number;
  @Input()
  set month(month: number) {
    this._month = month;
    this.fetch();
  }

  /**
   * year of sale
   */
  public _year: number;
  @Input()
  set year(year: number) {
    this._year = year;
    this.fetch();
  }

  /**
   * View Region trigger
   * @type {EventEmitter<any>}
   */
  @Output()
  viewRegion = new EventEmitter();

  /**
   * regions
   *
   * @type {{}}
   */
  public regions: Region[] = [];
  public vacant_hq_counts: Region[] = [];
  public attendances: Attendance[] = [];
  public all_visits: Visit[] = [];
  public hq_visits: Visit[] = [];
  public orders: Order[] = [];
  public total_orders: Order[] = [];
  public customer_type_wise_visits: Visit[] = [];
  public region_ids = [];

  /**
   * TillMonthChartComponent constructor
   */
  constructor(private reportService: ReportService, public _service: AuthService) {
    super(_service);
  }

  /**
   * initialize data
   */
  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * Chart data
   */
  fetch() {
    if (!this.loading && (this._month || this._month == 0) && this._year) {
      this.loading = true;
      Observable.forkJoin(
        this.reportService.getZSMData(this._month + 1, this._year)
      ).subscribe(data => {
        // get regions
        this.attendances = data[0].attendances.map(att => new Attendance(att));
        this.all_visits = data[0].all_visits.map(vis => new Visit(vis));
        this.regions = data[0].regions.map(region => new Region(region));
        this.customer_type_wise_visits = data[0].customer_type_wise_visits.map(vis => new Visit(vis));
        this.hq_visits = data[0].hq_visits.map(vis => new Visit(vis));
        this.vacant_hq_counts = data[0].region_vacant_hq_counts.map(region => new Region(region));
        this.orders = data[0].orders.map(order => new Order(order));
        this.total_orders = data[0].order_counts.map(order => new Order(order));

        this.prepareData();
        this.loading = false;
      }, err => {
        this.loading = false;
      });
    }
  }

  /**
   * Prepare Data
   */
  prepareData() {
    this.regions.map(region => {
      this.attendances.map(att => {
        if (region.id == att.hq_region_id)
          region.total_att = att.att_count
      });

      this.all_visits.map(vis => {
        if (region.id == vis.hq_region_id)
          region.all_total_visit += vis.visit_count
      });

      // add order total amount
      this.orders.map(order => {
        if (region.id == order.hq_region_id)
          region.total_pob += order.order_day_total_count
      });

      // total order count
      this.total_orders.map(ord => {
        if (ord.hq_region_id == region.id)
          region.total_order += ord.order_count;
      });

      // add customer type wise visit count to region
      this.customer_type_wise_visits.map(vis => {
        if (vis.customer_type_id == 2 && vis.hq_region_id == region.id) {
          region.semi_total_visit_count += vis.visit_count;
        }
        else if (vis.customer_type_id == 3 && vis.hq_region_id == region.id) {
          region.retailer_total_visit_count += vis.visit_count;
        }
        else if (vis.customer_type_id == 5 && vis.hq_region_id == region.id) {
          region.hcp_total_visit_count += vis.visit_count;
        }
      });
    });
  }

  /**
   * get field work area count
   * @returns {number}
   */
  get onRegionFieldWorkGreaterThan95PercentageWithNorm20() {
    let value = 0;
    this.region_ids = [];
    value += this.attendances.filter(att => att.hq_region_id ? att.greaterThan95PercentWithNorm20 : 0).length;
    this.attendances.map(att => {
      if (att.greaterThan95PercentWithNorm20)
        this.region_ids.push({'region_id': att.hq_region_id, 'count': att.att_count})
    });
    return value;
  }

  /**
   * get get field work area count
   * @returns {number}
   */
  get onRegionFieldWorkInBetween85To95PercentageWithNorm20() {
    let value = 0;
    this.region_ids = [];
    value += this.attendances.filter(att => att.hq_region_id ? att.inBetween85To95PercentWithNorm20 : 0).length;
    this.attendances.map(att => {
      if (att.inBetween85To95PercentWithNorm20)
        this.region_ids.push({'region_id': att.hq_region_id, 'count': att.att_count})
    });
    return value;
  }

  /**
   * get get field work area count
   * @returns {number}
   */
  get onRegionFieldWorkLessThan85PercentageWithNorm20() {
    let value = 0;
    this.region_ids = [];
    value += this.attendances.filter(att => att.hq_region_id ? att.lessThan85PercentWithNorm20 : 0).length;
    this.attendances.map(att => {
      if (att.lessThan85PercentWithNorm20)
        this.region_ids.push({'region_id': att.hq_region_id, 'count': att.att_count})
    });
    return value;
  }

  /**
   * get field work area count
   * @returns {number}
   */
  get onRegionWorkWithGreaterThan95PercentageWithNorm12() {
    let value = 0;
    this.region_ids = [];
    value += this.attendances.filter(att => att.hq_region_id ? att.workingWithGreaterThan95PercentWithNorm12 : 0).length;
    this.attendances.map(att => {
      if (att.workingWithGreaterThan95PercentWithNorm12)
        this.region_ids.push({'region_id': att.hq_region_id, 'count': att.working_with_count})
    });
    return value;
  }

  /**
   * get get field work area count
   * @returns {number}
   */
  get onRegionWorkWithInBetween85To95PercentageWithNorm12() {
    let value = 0;
    this.region_ids = [];
    value += this.attendances.filter(att => att.hq_region_id ? att.workingWithInBetween85To95PercentWithNorm12 : 0).length;
    this.attendances.map(att => {
      if (att.workingWithInBetween85To95PercentWithNorm12)
        this.region_ids.push({'region_id': att.hq_region_id, 'count': att.working_with_count})
    });
    return value;
  }

  /**
   * get get field work area count
   * @returns {number}
   */
  get onRegionWorkWithLessThan85PercentageWithNorm12() {
    let value = 0;
    this.region_ids = [];
    value += this.attendances.filter(att => att.hq_region_id ? att.workingWithLessThan85PercentWithNorm12 : 0).length;
    this.attendances.map(att => {
      if (att.workingWithLessThan85PercentWithNorm12)
        this.region_ids.push({'region_id': att.hq_region_id, 'count': att.working_with_count})
    });
    return value;
  }

  /**
   * Get Area count With call average is greater than 95%
   * @returns {number}
   */
  get onRegionCallAverageGreaterThan95PercentageWithNorm25() {
    let value = 0;
    this.region_ids = [];
    value += this.regions.filter(region => region.id ? region.callAverageGreaterThan95PercentageWith25 : 0).length;
    this.regions.map(region => {
      if (region.callAverageGreaterThan95PercentageWith25)
        this.region_ids.push({
          'region_id': region.id,
          'count': region.total_att > 0 ? (region.all_total_visit / region.total_att).toFixed(2) : ''
        })
    });
    return value;
  }

  /**
   * Get Area count With call average is Between 85% To 95%
   * @returns {number}
   */
  get onRegionCallAverageBetween85To95PercentageWithNorm25() {
    let value = 0;
    this.region_ids = [];
    value += this.regions.filter(region => region.id ? region.callAverageBetween85To95PercentageWith25 : 0).length;
    this.regions.map(region => {
      if (region.callAverageBetween85To95PercentageWith25)
        this.region_ids.push({
          'region_id': region.id,
          'count': region.total_att > 0 ? (region.all_total_visit / region.total_att).toFixed(2) : ''
        })
    });
    return value;
  }

  /**
   * Get Area count With call average is less than 85%
   * @returns {number}
   */
  get onRegionCallAverageLessThan95PercentageWithNorm25() {
    let value = 0;
    this.region_ids = [];
    value += this.regions.filter(region => region.id ? region.callAverageLessThan85PercentageWith25 : 0).length;
    this.regions.map(region => {
      if (region.callAverageLessThan85PercentageWith25)
        this.region_ids.push({
          'region_id': region.id,
          'count': region.total_att > 0 ? (region.all_total_visit / region.total_att).toFixed(2) : ''
        })
    });
    return value;
  }

  /**
   * get field work area count
   * @returns {number}
   */
  get onRegionWorkedInHqGreaterThan95PercentageWithNorm8() {
    let value = 0;
    this.region_ids = [];
    value += this.hq_visits.filter(vis => vis.hq_region_id ? vis.workedWithRegionHQGreaterThan95PercentageWith8 : 0).length;
    this.hq_visits.map(vis => {
      if(vis.workedWithRegionHQGreaterThan95PercentageWith8)
        this.region_ids.push({
          'region_id': vis.hq_region_id,
          'count': vis.visited_hq
        })
    });
    return value;
  }

  /**
   * get get field work area count
   * @returns {number}
   */
  get onRegionWorkedInHqInBetween85To95PercentageWithNorm8() {
    let value = 0;
    this.region_ids = [];
    value += this.hq_visits.filter(vis => vis.hq_region_id ? vis.workedWithRegionHQBetween85To95PercentageWith8 : 0).length;
    this.hq_visits.map(vis => {
      if(vis.workedWithRegionHQBetween85To95PercentageWith8)
        this.region_ids.push({
          'region_id': vis.hq_region_id,
          'count': vis.visited_hq
        })
    });

    return value;
  }

  /**
   * get get field work area count
   * @returns {number}
   */
  get onRegionWorkedInHqLessThan85PercentageWithNorm8() {
    let value = 0;
    this.region_ids = [];
    value += this.hq_visits.filter(vis => vis.hq_region_id ? vis.workedWithRegionHQLessThan85PercentageWith8 : 0).length;
    this.hq_visits.map(vis => {
      if(vis.workedWithRegionHQLessThan85PercentageWith8)
        this.region_ids.push({
          'region_id': vis.hq_region_id,
          'count': vis.visited_hq
        })
    });

    return value;
  }

  /**
   * Get HQ count With call average is less than 85%
   * @returns {number}
   */
  customerMetWithGreaterThan95Percentage(customer_type_id, above_count) {
    let value = 0;
    this.region_ids = [];
    value += this.regions.filter(region => region.id ? region.customerMetAbove(customer_type_id, above_count) : 0).length;
    this.regions.map(region => {
      if(region.customerMetAbove(customer_type_id, above_count))
        this.region_ids.push({
          'region_id': region.id,
          'count': region.customerMetValue(customer_type_id)
        })
    });

    return value;
  }

  /**
   * Get HQ count With call average is less than 85%
   * @returns {number}
   */
  customerMetWith85To95Percentage(customer_type_id, above_count, below_count) {
    let value = 0;
    this.region_ids = [];
    value += this.regions.filter(region => region.id ? region.customerMetBetween(customer_type_id, above_count, below_count) : 0).length;
    this.regions.map(region => {
      if(region.customerMetBetween(customer_type_id, above_count, below_count))
        this.region_ids.push({
          'region_id': region.id,
          'count': region.customerMetValue(customer_type_id)
        })
    });
    return value;
  }

  /**
   * Get HQ count With call average is less than 85%
   * @returns {number}
   */
  customerMetWithLessThan85Percentage(customer_type_id, below_count) {
    let value = 0;
    this.region_ids = [];
    value += this.regions.filter(region => region.id ? region.customerMetBelow(customer_type_id, below_count) : 0).length;
    this.regions.map(region => {
      if(region.customerMetBelow(customer_type_id, below_count))
        this.region_ids.push({
          'region_id': region.id,
          'count': region.customerMetValue(customer_type_id)
        })
    });
    return value;
  }

  /**
   * Get region count for hq empty
   * @returns {number}
   */
  get vacantHQCounts() {
    let value = 0;
    value += this.vacant_hq_counts.filter(region => region.id ? region.vacant_hq_count > 0 : 0).length;
    return value;
  }

  /**
   * Get HQ Count Productive Calls Greater Than 95%
   * @returns {number}
   */
  get pobPerDayGreaterThan95Percentage() {
    let value = 0;
    this.region_ids = [];
    value += this.regions.filter(region => region.id ? region.pobPerDayGreaterThan95Percentage : 0).length;
    this.regions.map(region => {
      if (region.pobPerDayGreaterThan95Percentage)
        this.region_ids.push({
          'region_id': region.id,
          'count': region.total_att > 0 ? (region.total_pob / region.total_att).toFixed(0) : ''
        });
    });
    return value;
  }

  /**
   * Get HQ count Productive Calls Between 85% To 95%
   * @returns {number}
   */
  get pobPerDayBetween85To95Percentage() {
    let value = 0;
    this.region_ids = [];
    value += this.regions.filter(region => region.id ? region.pobPerDayBetween85To95Percentage : 0).length;
    this.regions.map(region => {
      if (region.pobPerDayBetween85To95Percentage)
        this.region_ids.push({
          'region_id': region.id,
          'count': region.total_att > 0 ? (region.total_pob / region.total_att).toFixed(0) : ''
        });
    });
    return value;
  }

  /**
   * Get HQ count Productive Calls is less than 85%
   * @returns {number}
   */
  get pobPerDayLessThan85Percentage() {
    let value = 0;
    this.region_ids = [];
    value += this.regions.filter(region => region.id ? region.pobPerDayBelow85Percentage : 0).length;
    this.regions.map(region => {
      if (region.pobPerDayBelow85Percentage)
        this.region_ids.push({
          'region_id': region.id,
          'count': region.total_att > 0 ? (region.total_pob / region.total_att).toFixed(0) : ''
        });
    });
    return value;
  }

  /**
   * Get HQ Count Productive Calls Greater Than 95%
   * @returns {number}
   */
  get minimumProductiveCallsWithGreaterThan95Percentage() {
    let value = 0;
    this.region_ids = [];
    value += this.regions.filter(region => region.id ? region.minimumProductiveCallsAbove : 0).length;
    this.regions.map(region => {
      if (region.minimumProductiveCallsAbove)
        this.region_ids.push({
          'region_id': region.id,
          'count': region.total_att > 0 ? (region.total_order / region.total_att).toFixed(0) : ''
        });
    });
    return value;
  }

  /**
   * Get HQ count Productive Calls Between 85% To 95%
   * @returns {number}
   */
  get minimumProductiveCallsWithBetween85To95Percentage() {
    let value = 0;
    this.region_ids = [];
    value += this.regions.filter(region => region.id ? region.minimumProductiveCallsBetween : 0).length;
    this.regions.map(region => {
      if (region.minimumProductiveCallsBetween)
        this.region_ids.push({
          'region_id': region.id,
          'count':region.total_att > 0 ? (region.total_order / region.total_att).toFixed(0) : ''
        });
    });
    return value;
  }

  /**
   * Get HQ count Productive Calls is less than 85%
   * @returns {number}
   */
  get minimumProductiveCallsWithLessThan85Percentage() {
    let value = 0;
    this.region_ids = [];
    value += this.regions.filter(region=> region.id ? region.minimumProductiveCallBelow : 0).length;
    this.regions.map(region => {
      if (region.minimumProductiveCallBelow)
        this.region_ids.push({
          'region_id': region.id,
          'count': region.total_att > 0 ? (region.total_order / region.total_att).toFixed(0) : ''
        });
    });
    return value;
  }


  /**
   * Open 95 Percentage Modal
   * @param value
   */
  openAbove95PercentageModal(value) {
    if (value == 'NoOfFieldWorkingDays')
      this.onRegionFieldWorkGreaterThan95PercentageWithNorm20;
    else if (value == 'WorkingWith')
      this.onRegionWorkWithGreaterThan95PercentageWithNorm12;
    else if (value == 'DailyCallAverage')
      this.onRegionCallAverageGreaterThan95PercentageWithNorm25;
    else if (value == 'NoOfHQWorkedIn')
      this.onRegionWorkedInHqGreaterThan95PercentageWithNorm8;
    else if (value == 'HCPMet')
      this.customerMetWithGreaterThan95Percentage(5, 2.85);
    else if (value == 'SemiMet')
      this.customerMetWithGreaterThan95Percentage(2, 2.85);
    else if (value == 'RetailerMet')
      this.customerMetWithGreaterThan95Percentage(3, 9.5);
    else if (value == 'POBPerDay')
      this.pobPerDayGreaterThan95Percentage;
    else if (value == 'MinimumProductiveCalls/Day')
      this.minimumProductiveCallsWithGreaterThan95Percentage;

    this.openRegionModal(value + ' >= 95%');
  }

  /**
   * Open 95 Percentage Modal
   * @param value
   */
  openBetween85To95PercentageModal(value) {
    if (value == 'NoOfFieldWorkingDays')
      this.onRegionFieldWorkInBetween85To95PercentageWithNorm20;
    else if (value == 'WorkingWith')
      this.onRegionWorkWithInBetween85To95PercentageWithNorm12;
    else if (value == 'DailyCallAverage')
      this.onRegionCallAverageBetween85To95PercentageWithNorm25;
    else if (value == 'NoOfHQWorkedIn')
      this.onRegionWorkedInHqInBetween85To95PercentageWithNorm8;
    else if (value == 'HCPMet')
      this.customerMetWith85To95Percentage(5, 2.55, 2.85);
    else if (value == 'SemiMet')
      this.customerMetWith85To95Percentage(2, 2.55, 2.85);
    else if (value == 'RetailerMet')
      this.customerMetWith85To95Percentage(3, 8.5, 9.5);
    else if (value == 'POBPerDay')
      this.pobPerDayBetween85To95Percentage;
    else if (value == 'MinimumProductiveCalls/Day')
      this.minimumProductiveCallsWithBetween85To95Percentage;

    this.openRegionModal(value + ' 85-95%');
  }

  /**
   * Open 95 Percentage Modal
   * @param value
   */
  openBelow85PercentageModal(value) {
    if (value == 'NoOfFieldWorkingDays')
      this.onRegionFieldWorkLessThan85PercentageWithNorm20;
    else if (value == 'WorkingWith')
      this.onRegionWorkWithLessThan85PercentageWithNorm12;
    else if (value == 'DailyCallAverage')
      this.onRegionCallAverageLessThan95PercentageWithNorm25;
    else if (value == 'NoOfHQWorkedIn')
      this.onRegionWorkedInHqLessThan85PercentageWithNorm8;
    else if (value == 'HCPMet')
      this.customerMetWithLessThan85Percentage(5, 2.55);
    else if (value == 'SemiMet')
      this.customerMetWithLessThan85Percentage(2, 2.55);
    else if (value == 'RetailerMet')
      this.customerMetWithLessThan85Percentage(3, 8.5);
    else if (value == 'POBPerDay')
      this.pobPerDayLessThan85Percentage;
    else if (value == 'MinimumProductiveCalls/Day')
      this.minimumProductiveCallsWithLessThan85Percentage;

    this.openRegionModal(value + ' <= 85%');
  }


  /**
   * Open Region Modal
   */
  openRegionModal(title) {
    if (this.region_ids && this.region_ids.length > 0)
      this.viewRegion.emit({'region_ids': this.region_ids, 'title': title});
  }
}

