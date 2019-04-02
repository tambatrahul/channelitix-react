import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ListComponent} from "../../../../base/list.component";
import {ReportService} from "../../../../../services/report.service";
import {AuthService} from "../../../../../services/AuthService";
import {Observable} from "rxjs/Observable";
import {Attendance} from "../../../../../models/attendance/attendance";
import {Visit} from "../../../../../models/visit/visit";
import {Customer} from "../../../../../models/customer/customer";
import {Headquarter} from "../../../../../models/territory/headquarter";
import {Order} from "../../../../../models/order/order";
import {PrimarySale} from "../../../../../models/sale/primary_sale";
import {Brick} from "../../../../../models/territory/brick";

@Component({
  selector: '[cse-field-efforts-audit-scorecard]',
  styleUrls: ['cse_field_efforts_audit_scorecard.component.less'],
  templateUrl: 'cse_field_efforts_audit_scorecard.component.html'
})
export class CSEFieldEffortsAuditScorecard extends ListComponent {

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
   * Save invoice trigger
   * @type {EventEmitter<any>}
   */
  @Output()
  viewHeadquarter = new EventEmitter();

  // collect headquarter ids
  headquarter_ids = [];
  brick_ids = [];

  /**
   *
   * @type {Array}
   */
  public attendances: Attendance[] = [];
  public headquarters: Headquarter[] = [];
  public customers: Customer[] = [];
  public customer_type_wise_visits: Visit[] = [];
  public v2_v3_visits: Visit[] = [];
  public all_visits: Visit[] = [];
  public orders: Order[] = [];
  public total_orders: Order[] = [];
  public primaries: PrimarySale[] = [];
  public bricks: Brick[] = [];

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
    this.fetch();
  }

  /**
   * Chart data
   */
  fetch() {
    if (!this.loading && (this._month || this._month == 0) && this._year) {
      this.loading = true;
      Observable.forkJoin(
        this.reportService.getCoverageAndVisitsForCSE(this._month, this._year)
      ).subscribe(data => {
        // get regions
        this.attendances = data[0].attendances.map(att => new Attendance(att));
        this.all_visits = data[0].all_visits.map(vis => new Visit(vis));
        this.v2_v3_visits = data[0].v2_v3_visits.map(vis => new Visit(vis));
        this.headquarters = data[0].headquarters.map(hq => new Headquarter(hq));
        this.customers = data[0].customers.map(cus => new Customer(cus));
        this.customer_type_wise_visits = data[0].customer_type_wise_visits.map(vis => new Visit(vis));
        this.orders = data[0].orders.map(order => new Order(order));
        this.primaries = data[0].primary_sales.map(primary => new PrimarySale(primary));
        this.bricks = data[0].bricks.map(brick => new Brick(brick));
        this.total_orders = data[0].order_counts.map(ord => new Order(ord));

        this.prepareData();

        this.loading = false;
      }, err => {
        this.loading = false;
      });
    }
  }

  /**
   * Prepare All Data For Call Average
   */
  prepareData() {
    this.headquarters.map(hq => {
      this.attendances.map(att => {
        if (att.hq_headquarter_id == hq.id) {
          hq.total_att = att.att_count;
        }
      });

      this.all_visits.map(vis => {
        if (vis.hq_headquarter_id == hq.id) {
          hq.all_total_visit += vis.visit_count;
        }
      });

      // add customer type wise visit count to hq
      this.customer_type_wise_visits.map(vis => {
        if (vis.customer_type_id == 1 && vis.hq_headquarter_id == hq.id) {
          hq.stockist_total_visit_count += vis.visit_count;
          hq.customer_total_visit_count += vis.visit_count;
        }
        else if (vis.customer_type_id == 2 && vis.hq_headquarter_id == hq.id) {
          hq.semi_total_visit_count += vis.visit_count;
          hq.customer_total_visit_count += vis.visit_count;
        }
        else if (vis.customer_type_id == 3 && vis.hq_headquarter_id == hq.id) {
          hq.retailer_total_visit_count += vis.visit_count;
          hq.customer_total_visit_count += vis.visit_count;
        }
        else if (vis.customer_type_id == 4 && vis.hq_headquarter_id == hq.id) {
          hq.hub_chemist_total_visit_count += vis.visit_count;
          hq.customer_total_visit_count += vis.visit_count;
        }
        else if (vis.customer_type_id == 5 && vis.hq_headquarter_id == hq.id) {
          hq.hcp_total_visit_count += vis.visit_count;
          hq.customer_total_visit_count += vis.visit_count;
        }
      });

      // add customer count to hq
      this.customers.map(cus => {
        if (cus.customer_type_id == 1 && cus.hq_headquarter_id == hq.id) {
          hq.stockist_total_count += cus.visit_count;
          hq.customer_total_count += cus.visit_count;
        }
        else if (cus.customer_type_id == 2 && cus.hq_headquarter_id == hq.id) {
          hq.semi_total_count += cus.visit_count;
          hq.customer_total_count += cus.visit_count;
        }
        else if (cus.customer_type_id == 3 && cus.hq_headquarter_id == hq.id) {
          hq.retailer_total_count += cus.visit_count;
          hq.customer_total_count += cus.visit_count;
        }
        else if (cus.customer_type_id == 4 && cus.hq_headquarter_id == hq.id) {
          hq.hub_chemist_total_count += cus.visit_count;
          hq.customer_total_count += cus.visit_count;
        }
        else if (cus.customer_type_id == 5 && cus.hq_headquarter_id == hq.id) {
          hq.hcp_total_count += cus.visit_count;
          hq.customer_total_count += cus.visit_count;
        }
      });

      // map order to headquarter
      this.orders.map(order => {
        if (order.hq_headquarter_id == hq.id) {
          hq.total_pob += order.order_total_count;
        }
      });

      // total order count
      this.total_orders.map(ord => {
        if (ord.hq_headquarter_id == hq.id)
          hq.total_order += ord.order_count;
      });

      // map primary to headquarter
      this.primaries.map(primary => {
        if (primary.hq_headquarter_id == hq.id) {
          hq.total_primary = primary.total_net_amount;
        }
      });
    });
  }

  /**
   * get total target count
   * @returns {number}
   */
  get onHQGreaterThan95PercentageWithNorm25() {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.attendances.filter(att => att.hq_headquarter_id ? att.greaterThan95PercentWithNorm25 : 0).length;
    this.attendances.map(att => {
      if (att.greaterThan95PercentWithNorm25)
        this.headquarter_ids.push({
          'headquarter_id': att.hq_headquarter_id,
          'count': att.att_count > 0 ? att.att_count : ''
        });
    });
    return value;
  }

  /**
   * get total target count
   * @returns {number}
   */
  get onHQInBetween85To95PercentageWithNorm25() {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.attendances.filter(att => att.hq_headquarter_id ? att.inBetween85To95PercentWithNorm25 : 0).length;
    this.attendances.map(att => {
      if (att.inBetween85To95PercentWithNorm25)
        this.headquarter_ids.push({
          'headquarter_id': att.hq_headquarter_id,
          'count': att.att_count > 0 ? att.att_count : ''
        });
    });
    return value;
  }

  /**
   * get total target count
   * @returns {number}
   */
  get onHQLessThan85PercentageWithNorm25() {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.attendances.filter(att => att.hq_headquarter_id ? att.lessThan85PercentWithNorm25 : 0).length;
    this.attendances.map(att => {
      if (att.lessThan85PercentWithNorm25)
        this.headquarter_ids.push({
          'headquarter_id': att.hq_headquarter_id,
          'count': att.att_count > 0 ? att.att_count : ''
        });
    });
    return value;
  }

  /**
   * Get Visited Twice HQ Count Greater Than 95%
   * @returns {number}
   */
  get onHQVisitedTwiceVisitCountGreaterThan95PercentageWithNorm25() {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.v2_v3_visits.filter(vis => vis.hq_headquarter_id ? vis.visitedTwiceWithNorm25HavingGreaterThan95Percentage : 0).length;
    this.v2_v3_visits.map(vis => {
      if (vis.visitedTwiceWithNorm25HavingGreaterThan95Percentage)
        this.headquarter_ids.push({'headquarter_id': vis.hq_headquarter_id, 'count': vis.visited_twice});
    });
    return value;
  }

  /**
   * Get Visited Twice HQ Count Between 85% To 95%
   * @returns {number}
   */
  get onHQVisitedTwiceVisitCountBetween85To95PercentageWithNorm25() {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.v2_v3_visits.filter(vis => vis.hq_headquarter_id ? vis.visitedTwiceWithNorm25Between85To95Percentage : 0).length;
    this.v2_v3_visits.map(vis => {
      if (vis.visitedTwiceWithNorm25Between85To95Percentage)
        this.headquarter_ids.push({'headquarter_id': vis.hq_headquarter_id, 'count': vis.visited_twice});
    });
    return value;
  }

  /**
   * Get Visited Twice HQ Count Less Than 85%
   * @returns {number}
   */
  get onHQVisitedTwiceVisitCountLessThan85PercentageWithNorm25() {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.v2_v3_visits.filter(vis => vis.hq_headquarter_id ? vis.visitedTwiceWithNorm25HavingLessThan85Percentage : 0).length;
    this.v2_v3_visits.map(vis => {
      if (vis.visitedTwiceWithNorm25HavingLessThan85Percentage)
        this.headquarter_ids.push({'headquarter_id': vis.hq_headquarter_id, 'count': vis.visited_twice});
    });
    return value;
  }

  /**
   * Get HQ count With call average is greater than 95%
   * @returns {number}
   */
  get onHQCallAverageGreaterThan95PercentageWithNorm25() {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.headquarters.filter(hq => hq.id ? hq.callAverageGreaterThan95PercentageWith25 : 0).length;
    this.headquarters.map(hq => {
      if (hq.callAverageGreaterThan95PercentageWith25)
        this.headquarter_ids.push({
          'headquarter_id': hq.id,
          'count': (hq.all_total_visit / hq.total_att).toFixed(2)
        });
    });
    return value;
  }

  /**
   * Get HQ count With call average is Between 85% To 95%
   * @returns {number}
   */
  get onHQCallAverageBetween85To95PercentageWithNorm25() {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.headquarters.filter(hq => hq.id && hq.status == 'active' ? hq.callAverageBetween85To95PercentageWith25 : 0).length;
    this.headquarters.map(hq => {
      if (hq.callAverageBetween85To95PercentageWith25)
        this.headquarter_ids.push({
          'headquarter_id': hq.id,
          'count': (hq.all_total_visit / hq.total_att).toFixed(2)
        });
    });
    return value;
  }

  /**
   * Get HQ count With call average is less than 85%
   * @returns {number}
   */
  get onHQCallAverageLessThan85PercentageWithNorm25() {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.headquarters.filter(hq => hq.id ? hq.callAverageLessThan85PercentageWith25 : 0).length;
    this.headquarters.map(hq => {
      if (hq.callAverageLessThan85PercentageWith25)
        this.headquarter_ids.push({
          'headquarter_id': hq.id,
          'count': (hq.all_total_visit / hq.total_att).toFixed(2)
        });
    });
    return value;
  }

  /**
   * Get HQ count With call average is less than 85%
   * @returns {number}
   */
  customerCoverageWithGreaterThan95Percentage(customer_type_id, percentage) {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.headquarters.filter(hq => hq.id ? hq.customerCoverageAbove(customer_type_id, percentage) : 0).length;
    this.headquarters.map(hq => {
      if (hq.customerCoverageAbove(customer_type_id, percentage))
        this.headquarter_ids.push({
          'headquarter_id': hq.id,
          'count': hq.customerCoverageValue(customer_type_id)
        });
    });
    return value;
  }

  /**
   * Get HQ count With call average is less than 85%
   * @returns {number}
   */
  customerCoverageWith85To95Percentage(customer_type_id, above_percentage, below_percentage) {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.headquarters.filter(hq => hq.id ? hq.customerCoverageBetween(customer_type_id, above_percentage, below_percentage) : 0).length;
    this.headquarters.map(hq => {
      if (hq.customerCoverageBetween(customer_type_id, above_percentage, below_percentage))
        this.headquarter_ids.push({
          'headquarter_id': hq.id,
          'count': hq.customerCoverageValue(customer_type_id)
        });
    });
    return value;
  }

  /**
   * Get HQ count With call average is less than 85%
   * @returns {number}
   */
  customerCoverageWithLessThan85Percentage(customer_type_id, below_percentage) {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.headquarters.filter(hq => hq.id ? hq.customerCoverageBelow(customer_type_id, below_percentage) : 0).length;
    this.headquarters.map(hq => {
      if (hq.customerCoverageBelow(customer_type_id, below_percentage))
        this.headquarter_ids.push({
          'headquarter_id': hq.id,
          'count': hq.customerCoverageValue(customer_type_id)
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
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.headquarters.filter(hq => hq.id ? hq.customerMetAbove(customer_type_id, above_count) : 0).length;
    this.headquarters.map(hq => {
      if (hq.customerMetAbove(customer_type_id, above_count))
        this.headquarter_ids.push({
          'headquarter_id': hq.id,
          'count': hq.customerMetValue(customer_type_id)
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
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.headquarters.filter(hq => hq.id ? hq.customerMetBetween(customer_type_id, above_count, below_count) : 0).length;
    this.headquarters.map(hq => {
      if (hq.customerMetBetween(customer_type_id, above_count, below_count))
        this.headquarter_ids.push({
          'headquarter_id': hq.id,
          'count': hq.customerMetValue(customer_type_id)
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
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.headquarters.filter(hq => hq.id ? hq.customerMetBelow(customer_type_id, below_count) : 0).length;
    this.headquarters.map(hq => {
      if (hq.customerMetBelow(customer_type_id, below_count))
        this.headquarter_ids.push({
          'headquarter_id': hq.id,
          'count': hq.customerMetValue(customer_type_id)
        });
    });
    return value;
  }

  /**
   * Get HQ Count Productive Calls Greater Than 95%
   * @returns {number}
   */
  get pobPerDayGreaterThan95Percentage() {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.headquarters.filter(hq => hq.id ? hq.pobPerDayGreaterThan95Percentage : 0).length;
    this.headquarters.map(hq => {
      if (hq.pobPerDayGreaterThan95Percentage)
        this.headquarter_ids.push({
          'headquarter_id': hq.id,
          'count': hq.total_att > 0 ? (hq.total_pob / hq.total_att).toFixed(0) : ''
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
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.headquarters.filter(hq => hq.id ? hq.pobPerDayBetween85To95Percentage : 0).length;
    this.headquarters.map(hq => {
      if (hq.pobPerDayBetween85To95Percentage)
        this.headquarter_ids.push({
          'headquarter_id': hq.id,
          'count': hq.total_att > 0 ? (hq.total_pob / hq.total_att).toFixed(0) : ''
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
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.headquarters.filter(hq => hq.id ? hq.pobPerDayBelow85Percentage : 0).length;
    this.headquarters.map(hq => {
      if (hq.pobPerDayBelow85Percentage)
        this.headquarter_ids.push({
          'headquarter_id': hq.id,
          'count': hq.total_att > 0 ? (hq.total_pob / hq.total_att).toFixed(0) : ''
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
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.headquarters.filter(hq => hq.id ? hq.minimumProductiveCallsAbove : 0).length;
    this.headquarters.map(hq => {
      if (hq.minimumProductiveCallsAbove)
        this.headquarter_ids.push({
          'headquarter_id': hq.id,
          'count': hq.total_att > 0 ? (hq.total_order / hq.total_att).toFixed(0) : ''
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
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.headquarters.filter(hq => hq.id ? hq.minimumProductiveCallsBetween : 0).length;
    this.headquarters.map(hq => {
      if (hq.minimumProductiveCallsBetween)
        this.headquarter_ids.push({
          'headquarter_id': hq.id,
          'count': hq.total_att > 0 ? (hq.total_order / hq.total_att).toFixed(0) : ''
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
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.headquarters.filter(hq => hq.id ? hq.minimumProductiveCallBelow : 0).length;
    this.headquarters.map(hq => {
      if (hq.minimumProductiveCallBelow)
        this.headquarter_ids.push({
          'headquarter_id': hq.id,
          'count': hq.total_att > 0 ? (hq.total_order / hq.total_att).toFixed(0) : ''
        });
    });
    return value;
  }


  /**
   * Get HQ count Percentage POB To Primary Sale Greater Than 95
   * @returns {number}
   */
  get percentagePOBToPrimarySaleWithGreaterThan95Percentage() {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.headquarters.filter(hq => hq.id ? hq.percentagePOBToPrimarySaleAbove : 0).length;
    this.headquarters.map(hq => {
      if (hq.percentagePOBToPrimarySaleAbove)
        this.headquarter_ids.push({
          'headquarter_id': hq.id,
          'count': hq.total_primary > 0 ? (hq.total_pob / hq.total_primary).toFixed(0) : ''
        });
    });
    return value;
  }

  /**
   * Get HQ count Percentage POB To Primary Sale Between 85% To 95%
   * @returns {number}
   */
  get percentagePOBToPrimarySaleWithBetween85To95Percentage() {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.headquarters.filter(hq => hq.id ? hq.percentagePOBToPrimarySaleBetween : 0).length;
    this.headquarters.map(hq => {
      if (hq.percentagePOBToPrimarySaleBetween)
        this.headquarter_ids.push({
          'headquarter_id': hq.id,
          'count': hq.total_primary > 0 ? (hq.total_pob / hq.total_primary).toFixed(0) : ''
        });
    });
    return value;
  }

  /**
   * Get HQ count Percentage POB To Primary Sale less than 85%
   * @returns {number}
   */
  get percentagePOBToPrimarySaleWithLessThan85Percentage() {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.headquarters.filter(hq => hq.id ? hq.percentagePOBToPrimarySaleBelow : 0).length;
    this.headquarters.map(hq => {
      if (hq.percentagePOBToPrimarySaleBelow)
        this.headquarter_ids.push({
          'headquarter_id': hq.id,
          'count': hq.total_primary > 0 ? (hq.total_pob / hq.total_primary).toFixed(0) : ''
        });
    });
    return value;
  }

  /**
   * Semi Greater Than 95%
   * @returns {number}
   */
  get semiGreaterThan95PercentageWithNorm12() {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.bricks.filter(brick => brick.semiGreaterThan95PercentWithNorm12).length;
    this.bricks.map(brick => {
      if (brick.semiGreaterThan95PercentWithNorm12)
        this.brick_ids.push({
          'brick_id': brick.hq_brick_id,
          'count': brick.total_customers
        });
    });
    return value;
  }

  /**
   * Semi In Between 85%-95%
   * @returns {number}
   */
  get semiInBetween85To95PercentageWithNorm12() {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.bricks.filter(brick => brick.semiInBetween85To95PercentWithNorm12).length;
    this.bricks.map(brick => {
      if (brick.semiInBetween85To95PercentWithNorm12)
        this.brick_ids.push({
          'brick_id': brick.hq_brick_id,
          'count': brick.total_customers
        });
    });
    return value;
  }

  /**
   * Semi Less Than 85%
   * @returns {number}
   */
  get semiLessThan85PercentageWithNorm12() {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.bricks.filter(brick => brick.semiLessThan85PercentWithNorm12).length;
    this.bricks.map(brick => {
      if (brick.semiLessThan85PercentWithNorm12)
        this.brick_ids.push({
          'brick_id': brick.hq_brick_id,
          'count': brick.total_customers
        });
    });
    return value;
  }

  /**
   * get total target count
   * @returns {number}
   */
  get hcpGreaterThan95PercentageWithNorm10() {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.bricks.filter(brick => brick.hcpGreaterThan95PercentWithNorm10).length;
    this.bricks.map(brick => {
      if (brick.hcpGreaterThan95PercentWithNorm10)
        this.brick_ids.push({
          'brick_id': brick.hq_brick_id,
          'count': brick.total_customers
        });
    });
    return value;
  }

  /**
   * get total target count
   * @returns {number}
   */
  get hcpInBetween85To95PercentageWithNorm10() {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.bricks.filter(brick => brick.hcpInBetween85To95PercentWithNorm10).length;
    this.bricks.map(brick => {
      if (brick.hcpInBetween85To95PercentWithNorm10)
        this.brick_ids.push({
          'brick_id': brick.hq_brick_id,
          'count': brick.total_customers
        });
    });
    return value;
  }

  /**
   * get total target count
   * @returns {number}
   */
  get hcpLessThan85PercentageWithNorm10() {
    let value = 0;
    this.headquarter_ids = [];
    this.brick_ids = [];
    value += this.bricks.filter(brick => brick.hcpLessThan85PercentWithNorm10).length;
    this.bricks.map(brick => {
      if (brick.hcpLessThan85PercentWithNorm10)
        this.brick_ids.push({
          'brick_id': brick.hq_brick_id,
          'count': brick.total_customers
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
      this.onHQGreaterThan95PercentageWithNorm25;
    else if (value == 'DailyCallAverage')
      this.onHQCallAverageGreaterThan95PercentageWithNorm25;
    else if (value == 'NoOfBricksVisitedTwice')
      this.onHQVisitedTwiceVisitCountGreaterThan95PercentageWithNorm25;
    else if (value == 'CustomerCoverage')
      this.customerCoverageWithGreaterThan95Percentage(null, 0.90);
    else if (value == 'StockistCoverage')
      this.customerCoverageWithGreaterThan95Percentage(1, 0.90);
    else if (value == 'SemiCoverage')
      this.customerCoverageWithGreaterThan95Percentage(2, 0.90);
    else if (value == 'RetailerCoverage')
      this.customerCoverageWithGreaterThan95Percentage(3, 0.90);
    else if (value == 'HCPCoverage')
      this.customerCoverageWithGreaterThan95Percentage(5, 0.90);
    else if (value == 'HUBCoverage')
      this.customerCoverageWithGreaterThan95Percentage(4, 0.90);
    else if (value == 'HCPMet')
      this.customerMetWithGreaterThan95Percentage(5, 0.285);
    else if (value == 'SemiMet')
      this.customerMetWithGreaterThan95Percentage(2, 0.285);
    else if (value == 'RetailerMet')
      this.customerMetWithGreaterThan95Percentage(3, 0.285);
    else if (value == 'POBPerDay')
      this.pobPerDayGreaterThan95Percentage;
    else if (value == 'MinimumProductiveCalls/Day')
      this.minimumProductiveCallsWithGreaterThan95Percentage;
    else if (value == '%ToPrimarySales')
      this.percentagePOBToPrimarySaleWithGreaterThan95Percentage;
    else if (value == 'NoOfBrickWithSemi')
      this.semiGreaterThan95PercentageWithNorm12;
    else if (value == 'NoOfBrickWithHCP')
      this.hcpGreaterThan95PercentageWithNorm10;

    this.openHeadquarterModal(value + ' >= 95%');
  }

  /**
   * Open 95 Percentage Modal
   * @param value
   */
  openBetween85To95PercentageModal(value) {
    if (value == 'NoOfFieldWorkingDays')
      this.onHQInBetween85To95PercentageWithNorm25;
    else if (value == 'DailyCallAverage')
      this.onHQCallAverageBetween85To95PercentageWithNorm25;
    else if (value == 'NoOfBricksVisitedTwice')
      this.onHQVisitedTwiceVisitCountBetween85To95PercentageWithNorm25;
    else if (value == 'CustomerCoverage')
      this.customerCoverageWith85To95Percentage(null, 0.80, 0.90);
    else if (value == 'StockistCoverage')
      this.customerCoverageWith85To95Percentage(1, 0.80, 0.90);
    else if (value == 'SemiCoverage')
      this.customerCoverageWith85To95Percentage(2, 0.80, 0.90);
    else if (value == 'RetailerCoverage')
      this.customerCoverageWith85To95Percentage(3, 0.80, 0.90);
    else if (value == 'HCPCoverage')
      this.customerCoverageWith85To95Percentage(5, 0.80, 0.90);
    else if (value == 'HUBCoverage')
      this.customerCoverageWith85To95Percentage(4, 0.80, 0.90);
    else if (value == 'HCPMet')
      this.customerMetWith85To95Percentage(5, 0.255, 0.285);
    else if (value == 'SemiMet')
      this.customerMetWith85To95Percentage(2, 0.255, 0.285);
    else if (value == 'RetailerMet')
      this.customerMetWith85To95Percentage(3, 0.255, 0.285);
    else if (value == 'POBPerDay')
      this.pobPerDayBetween85To95Percentage;
    else if (value == 'MinimumProductiveCalls/Day')
      this.minimumProductiveCallsWithBetween85To95Percentage;
    else if (value == '%ToPrimarySales')
      this.percentagePOBToPrimarySaleWithBetween85To95Percentage;
    else if (value == 'NoOfBrickWithSemi')
      this.semiInBetween85To95PercentageWithNorm12;
    else if (value == 'NoOfBrickWithHCP')
      this.hcpInBetween85To95PercentageWithNorm10;

    this.openHeadquarterModal(value + ' 85-95%');
  }

  /**
   * Open 95 Percentage Modal
   * @param value
   */
  openBelow85PercentageModal(value) {
    if (value == 'NoOfFieldWorkingDays')
      this.onHQLessThan85PercentageWithNorm25;
    else if (value == 'DailyCallAverage')
      this.onHQCallAverageLessThan85PercentageWithNorm25;
    else if (value == 'NoOfBricksVisitedTwice')
      this.onHQVisitedTwiceVisitCountLessThan85PercentageWithNorm25;
    else if (value == 'CustomerCoverage')
      this.customerCoverageWithLessThan85Percentage(null, 0.80);
    else if (value == 'StockistCoverage')
      this.customerCoverageWithLessThan85Percentage(1, 0.80);
    else if (value == 'SemiCoverage')
      this.customerCoverageWithLessThan85Percentage(2, 0.80);
    else if (value == 'RetailerCoverage')
      this.customerCoverageWithLessThan85Percentage(3, 0.80);
    else if (value == 'HCPCoverage')
      this.customerCoverageWithLessThan85Percentage(5, 0.80);
    else if (value == 'HUBCoverage')
      this.customerCoverageWithLessThan85Percentage(4, 0.80);
    else if (value == 'HCPMet')
      this.customerMetWithLessThan85Percentage(5, 0.255);
    else if (value == 'SemiMet')
      this.customerMetWithLessThan85Percentage(2, 0.255);
    else if (value == 'RetailerMet')
      this.customerMetWithLessThan85Percentage(3, 0.255);
    else if (value == 'POBPerDay')
      this.pobPerDayLessThan85Percentage;
    else if (value == 'MinimumProductiveCalls/Day')
      this.minimumProductiveCallsWithLessThan85Percentage;
    else if (value == '%ToPrimarySales')
      this.percentagePOBToPrimarySaleWithLessThan85Percentage;
    else if (value == 'NoOfBrickWithSemi')
      this.semiLessThan85PercentageWithNorm12;
    else if (value == 'NoOfBrickWithHCP')
      this.hcpLessThan85PercentageWithNorm10;

    this.openHeadquarterModal(value + ' <= 85%');
  }

  /**
   * Open Headquarter Modal
   */
  openHeadquarterModal(title) {
    if (this.headquarter_ids && this.headquarter_ids.length > 0)
      this.viewHeadquarter.emit({'headquarter_ids': this.headquarter_ids, 'title': title});
    else if (this.brick_ids && this.brick_ids.length > 0)
      this.viewHeadquarter.emit({'brick_ids': this.brick_ids, 'title': title});
  }
}

