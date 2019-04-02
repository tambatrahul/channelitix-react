import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ListComponent} from "../../../../base/list.component";
import {ReportService} from "../../../../../services/report.service";
import {AuthService} from "../../../../../services/AuthService";
import {Observable} from "rxjs/Observable";
import {Attendance} from "../../../../../models/attendance/attendance";
import {Visit} from "../../../../../models/visit/visit";
import {Area} from "../../../../../models/territory/area";
import {Order} from "../../../../../models/order/order";

@Component({
  selector: '[csm-field-efforts-audit-scorecard]',
  styleUrls: ['csm_field_efforts_audit_scorecard.component.less'],
  templateUrl: 'csm_field_efforts_audit_scorecard.component.html'
})
export class CSMFieldEffortsAuditScorecard extends ListComponent {
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
   * View Area trigger
   * @type {EventEmitter<any>}
   */
  @Output()
  viewArea = new EventEmitter();

  /**
   * regions
   *
   * @type {{}}
   */
  public areas: Area[] = [];
  public vacant_hq_counts: Area[] = [];
  public attendances: Attendance[] = [];
  public all_visits: Visit[] = [];
  public hq_visits: Visit[] = [];
  public orders: Order[] = [];
  public total_orders: Order[] = [];
  public customer_type_wise_visits: Visit[] = [];

  public area_ids = [];

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
        this.reportService.getCSMData(this._month, this._year)
      ).subscribe(data => {
        // get regions
        this.attendances = data[0].attendances.map(att => new Attendance(att));
        this.all_visits = data[0].all_visits.map(vis => new Visit(vis));
        this.areas = data[0].areas.map(area => new Area(area));
        this.customer_type_wise_visits = data[0].customer_type_wise_visits.map(vis => new Visit(vis));
        this.hq_visits = data[0].hq_visits.map(vis => new Visit(vis));
        this.vacant_hq_counts = data[0].area_vacant_hq_counts.map(area => new Area(area));
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
    this.areas.map(area => {
      this.attendances.map(att => {
        if (area.id == att.hq_area_id)
          area.total_att = att.att_count
      });

      this.all_visits.map(vis => {
        if (area.id == vis.hq_area_id)
          area.all_total_visit = vis.visit_count
      });

      // add order total amount
      this.orders.map(order => {
        if (area.id == order.hq_area_id)
          area.total_pob += order.order_day_total_count
      });

      // total order count
      this.total_orders.map(ord => {
        if (ord.hq_area_id == area.id)
          area.total_order += ord.order_count;
      });

      // add customer type wise visit count to area
      this.customer_type_wise_visits.map(vis => {
        if (vis.customer_type_id == 2 && vis.hq_area_id == area.id) {
          area.semi_total_visit_count += vis.visit_count;
        }
        else if (vis.customer_type_id == 3 && vis.hq_area_id == area.id) {
          area.retailer_total_visit_count += vis.visit_count;
        }
        else if (vis.customer_type_id == 5 && vis.hq_area_id == area.id) {
          area.hcp_total_visit_count += vis.visit_count;
        }
      });
    });
  }

  /**
   * get field work area count
   * @returns {number}
   */
  get onAreaFieldWorkGreaterThan95PercentageWithNorm22() {
    let value = 0;
    this.area_ids = [];
    value += this.attendances.filter(att => att.hq_area_id ? att.greaterThan95PercentWithNorm22 : 0).length;
    this.attendances.map(att => {
      if (att.greaterThan95PercentWithNorm22)
        this.area_ids.push({'area_id': att.hq_area_id, 'count': att.att_count});
    });
    return value;
  }

  /**
   * get get field work area count
   * @returns {number}
   */
  get onAreaFieldWorkInBetween85To95PercentageWithNorm22() {
    let value = 0;
    this.area_ids = [];
    value += this.attendances.filter(att => att.hq_area_id ? att.inBetween85To95PercentWithNorm22 : 0).length;
    this.attendances.map(att => {
      if (att.inBetween85To95PercentWithNorm22)
        this.area_ids.push({'area_id': att.hq_area_id, 'count': att.att_count});
    });
    return value;
  }

  /**
   * get get field work area count
   * @returns {number}
   */
  get onAreaFieldWorkLessThan85PercentageWithNorm22() {
    let value = 0;
    this.area_ids = [];
    value += this.attendances.filter(att => att.hq_area_id ? att.lessThan85PercentWithNorm22 : 0).length;
    this.attendances.map(att => {
      if (att.lessThan85PercentWithNorm22)
        this.area_ids.push({'area_id': att.hq_area_id, 'count': att.att_count});
    });
    return value;
  }

  /**
   * get field work area count
   * @returns {number}
   */
  get onAreaWorkWithGreaterThan95PercentageWithNorm4() {
    let value = 0;
    this.area_ids = [];
    value += this.attendances.filter(att => att.hq_area_id ? att.workingWithGreaterThan95PercentWithNorm4 : 0).length;
    this.attendances.map(att => {
      if (att.workingWithGreaterThan95PercentWithNorm4)
        this.area_ids.push({'area_id': att.hq_area_id, 'count': att.working_with_count});
    });
    return value;
  }

  /**
   * get get field work area count
   * @returns {number}
   */
  get onAreaWorkWithInBetween85To95PercentageWithNorm4() {
    let value = 0;
    this.area_ids = [];
    value += this.attendances.filter(att => att.hq_area_id ? att.workingWithInBetween85To95PercentWithNorm4 : 0).length;
    this.attendances.map(att => {
      if (att.workingWithInBetween85To95PercentWithNorm4)
        this.area_ids.push({'area_id': att.hq_area_id, 'count': att.working_with_count});
    });
    return value;
  }

  /**
   * get get field work area count
   * @returns {number}
   */
  get onAreaWorkWithLessThan85PercentageWithNorm4() {
    let value = 0;
    this.area_ids = [];
    value += this.attendances.filter(att => att.hq_area_id ? att.workingWithLessThan85PercentWithNorm4 : 0).length;
    this.attendances.map(att => {
      if (att.workingWithLessThan85PercentWithNorm4)
        this.area_ids.push({'area_id': att.hq_area_id, 'count': att.working_with_count});
    });
    return value;
  }

  /**
   * Get Area count With call average is greater than 95%
   * @returns {number}
   */
  get onAreaCallAverageGreaterThan95PercentageWithNorm25() {
    let value = 0;
    this.area_ids = [];
    value += this.areas.filter(area => area.id ? area.callAverageGreaterThan95PercentageWith25 : 0).length;
    this.areas.map(area => {
      if (area.callAverageGreaterThan95PercentageWith25)
        this.area_ids.push({
          'area_id': area.id,
          'count': area.total_att > 0 ? (area.all_total_visit / area.total_att).toFixed(2) : ''
        });
    });
    return value;
  }

  /**
   * Get Area count With call average is Between 85% To 95%
   * @returns {number}
   */
  get onAreaCallAverageBetween85To95PercentageWithNorm25() {
    let value = 0;
    this.area_ids = [];
    value += this.areas.filter(area => area.id && area.status == 'active' ? area.callAverageBetween85To95PercentageWith25 : 0).length;
    this.areas.map(area => {
      if (area.callAverageBetween85To95PercentageWith25)
        this.area_ids.push({
          'area_id': area.id,
          'count': area.total_att > 0 ? (area.all_total_visit / area.total_att).toFixed(2) : ''
        });
    });
    return value;
  }

  /**
   * Get Area count With call average is less than 85%
   * @returns {number}
   */
  get onAreaCallAverageLessThan95PercentageWithNorm25() {
    let value = 0;
    this.area_ids = [];
    value += this.areas.filter(area => area.id ? area.callAverageLessThan85PercentageWith25 : 2).length;
    this.areas.map(area => {
      if (area.callAverageLessThan85PercentageWith25)
        this.area_ids.push({
          'area_id': area.id,
          'count': area.total_att > 0 ? (area.all_total_visit / area.total_att).toFixed(0) : ''
        });
    });
    return value;
  }

  /**
   * get hq work in count
   * @returns {number}
   */
  get onAreaWorkedInHqGreaterThan95PercentageWithNorm4() {
    let value = 0;
    this.area_ids = [];
    value += this.hq_visits.filter(vis => vis.hq_area_id ? vis.workedWithAreaHQGreaterThan95PercentageWith4 : 0).length;
    this.hq_visits.map(vis => {
      if (vis.workedWithAreaHQGreaterThan95PercentageWith4)
        this.area_ids.push({
          'area_id': vis.hq_area_id,
          'count': vis.visited_hq
        });
    });
    return value;
  }

  /**
   * get hq work in count
   * @returns {number}
   */
  get onAreaWorkedInHqInBetween85To95PercentageWithNorm4() {
    let value = 0;
    this.area_ids = [];
    value += this.hq_visits.filter(vis => vis.hq_area_id ? vis.workedWithAreaHQBetween85To95PercentageWith4 : 0).length;
    this.hq_visits.map(vis => {
      if (vis.workedWithAreaHQBetween85To95PercentageWith4)
        this.area_ids.push({
          'area_id': vis.hq_area_id,
          'count': vis.visited_hq
        });
    });
    return value;
  }

  /**
   * get hq work in count
   * @returns {number}
   */
  get onAreaWorkedInHqLessThan85PercentageWithNorm4() {
    let value = 0;
    this.area_ids = [];
    value += this.hq_visits.filter(vis => vis.hq_area_id ? vis.workedWithAreaHQLessThan85PercentageWith4 : 0).length;
    this.hq_visits.map(vis => {
      if (vis.workedWithAreaHQLessThan85PercentageWith4)
        this.area_ids.push({
          'area_id': vis.hq_area_id,
          'count': vis.visited_hq
        });
    });
    return value;
  }

  /**
   * Get HQ count With call average is less than 85%
   * @returns {number}
   */
  customerMetWithGreaterThan95Percentage(customer_type_id, above_count) {
    let value = 0;
    this.area_ids = [];
    value += this.areas.filter(area => area.id ? area.customerMetAbove(customer_type_id, above_count) : 0).length;
    this.areas.map(area => {
      if (area.customerMetAbove(customer_type_id, above_count))
        this.area_ids.push({
          'area_id': area.id,
          'count': area.customerMetValue(customer_type_id)
        });
    });
    return value;
  }

  /**
   * Get HQ count With call average is less than 85%
   * @returns {number}
   */
  customerMetWith85To95Percentage(customer_type_id, above_count, below_count) {
    let value = 0;
    this.area_ids = [];
    value += this.areas.filter(area => area.id ? area.customerMetBetween(customer_type_id, above_count, below_count) : 0).length;
    this.areas.map(area => {
      if (area.customerMetBetween(customer_type_id, above_count, below_count))
        this.area_ids.push({
          'area_id': area.id,
          'count': area.customerMetValue(customer_type_id)
        });
    });
    return value;
  }

  /**
   * Get HQ count With call average is less than 85%
   * @returns {number}
   */
  customerMetWithLessThan85Percentage(customer_type_id, below_count) {
    let value = 0;
    this.area_ids = [];
    value += this.areas.filter(area => area.id ? area.customerMetBelow(customer_type_id, below_count) : 0).length;
    this.areas.map(area => {
      if (area.customerMetBelow(customer_type_id, below_count))
        this.area_ids.push({
          'area_id': area.id,
          'count': area.customerMetValue(customer_type_id)
        });
    });
    return value;
  }

  /**
   * Get Area empty HQ Counts
   * @returns {number}
   */
  get vacantHQCounts() {
    let value = 0;
    value += this.vacant_hq_counts.filter(area => area.id ? area.vacant_hq_count > 0 : 0).length;
    return value;
  }

  /**
   * Get HQ Count Productive Calls Greater Than 95%
   * @returns {number}
   */
  get pobPerDayGreaterThan95Percentage() {
    let value = 0;
    this.area_ids = [];
    value += this.areas.filter(area => area.id ? area.pobPerDayGreaterThan95Percentage : 0).length;
    this.areas.map(area => {
      if (area.pobPerDayGreaterThan95Percentage)
        this.area_ids.push({
          'area_id': area.id,
          'count': area.total_att > 0 ? (area.total_pob / area.total_att).toFixed(0) : ''
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
    this.area_ids = [];
    value += this.areas.filter(area => area.id ? area.pobPerDayBetween85To95Percentage : 0).length;
    this.areas.map(area => {
      if (area.pobPerDayBetween85To95Percentage)
        this.area_ids.push({
          'area_id': area.id,
          'count': area.total_att > 0 ? (area.total_pob / area.total_att).toFixed(0) : ''
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
    this.area_ids = [];
    value += this.areas.filter(area => area.id ? area.minimumProductiveCallsAbove : 0).length;
    this.areas.map(area => {
      if (area.minimumProductiveCallsAbove)
        this.area_ids.push({
          'area_id': area.id,
          'count': area.total_att > 0 ? (area.total_order / area.total_att).toFixed(0) : ''
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
    this.area_ids = [];
    value += this.areas.filter(area => area.id ? area.minimumProductiveCallsBetween : 0).length;
    this.areas.map(area => {
      if (area.minimumProductiveCallsBetween)
        this.area_ids.push({
          'area_id': area.id,
          'count':area.total_att > 0 ? (area.total_order / area.total_att).toFixed(0) : ''
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
    this.area_ids = [];
    value += this.areas.filter(area=> area.id ? area.minimumProductiveCallBelow : 0).length;
    this.areas.map(area => {
      if (area.minimumProductiveCallBelow)
        this.area_ids.push({
          'area_id': area.id,
          'count': area.total_att > 0 ? (area.total_order / area.total_att).toFixed(0) : ''
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
    this.area_ids = [];
    value += this.areas.filter(area => area.id ? area.pobPerDayBelow85Percentage : 0).length;
    this.areas.map(area => {
      if (area.pobPerDayBelow85Percentage)
        this.area_ids.push({
          'area_id': area.id,
          'count': area.total_att > 0 ? (area.total_pob / area.total_att).toFixed(0) : ''
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
      this.onAreaFieldWorkGreaterThan95PercentageWithNorm22;
    else if (value == 'WorkingWith')
      this.onAreaWorkWithGreaterThan95PercentageWithNorm4;
    else if (value == 'DailyCallAverage')
      this.onAreaCallAverageGreaterThan95PercentageWithNorm25;
    else if (value == 'NoOfHQWorkedIn')
      this.onAreaWorkedInHqGreaterThan95PercentageWithNorm4;
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

    this.openAreaModal(value + ' >= 95%');
  }

  /**
   * Open 95 Percentage Modal
   * @param value
   */
  openBetween85To95PercentageModal(value) {
    if (value == 'NoOfFieldWorkingDays')
      this.onAreaFieldWorkInBetween85To95PercentageWithNorm22;
    else if (value == 'WorkingWith')
      this.onAreaWorkWithInBetween85To95PercentageWithNorm4;
    else if (value == 'DailyCallAverage')
      this.onAreaCallAverageBetween85To95PercentageWithNorm25;
    else if (value == 'NoOfHQWorkedIn')
      this.onAreaWorkedInHqInBetween85To95PercentageWithNorm4;
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

    this.openAreaModal(value + ' 85-95%');
  }

  /**
   * Open 95 Percentage Modal
   * @param value
   */
  openBelow85PercentageModal(value) {
    if (value == 'NoOfFieldWorkingDays')
      this.onAreaFieldWorkLessThan85PercentageWithNorm22;
    else if (value == 'WorkingWith')
      this.onAreaWorkWithLessThan85PercentageWithNorm4;
    else if (value == 'DailyCallAverage')
      this.onAreaCallAverageLessThan95PercentageWithNorm25;
    else if (value == 'NoOfHQWorkedIn')
      this.onAreaWorkedInHqLessThan85PercentageWithNorm4;
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

    this.openAreaModal(value + ' <= 85%');
  }

  /**
   * Open Area Modal
   */
  openAreaModal(title) {
    if (this.area_ids && this.area_ids.length > 0)
      this.viewArea.emit({'area_ids': this.area_ids, 'title': title});
  }
}

