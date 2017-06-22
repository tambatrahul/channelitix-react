import {Component, Input} from "@angular/core";
import {ReportService} from "../../../../../../services/report.service";
import {AuthService} from "../../../../../../services/AuthService";
import {Region} from "../../../../../../models/territory/region";
import {ListComponent} from "../../../../../base/list.component";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {Order} from "../../../../../../models/order/order";
import {Attendance} from "../../../../../../models/attendance/attendance";
import {Visit} from "../../../../../../models/visit/visit";
import {Customer} from "../../../../../../models/customer/customer";

@Component({
  selector: '[ff-effort-metrics]',
  styleUrls: ['ff_effort_metrics.component.less'],
  templateUrl: 'ff_effort_metrics.component.html'
})
export class FFEffortMetricsComponent extends ListComponent {

  public _regions: Region[];
  @Input()
  set regions(regions) {
    this._regions = regions;
    this.fetch();
  }

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
   * get total pob to 30 percent of target
   * @type {number}
   */
  total_hq: number = 0;
  total_pob_to_30_target: number = 0;
  hq_on_target_count: number = 0;
  total_visits: number = 0;
  total_att: number = 0;
  total_hq_above_call_average: number = 0;
  total_hq_att_as_per_norm_23: number = 0;
  total_hq_att_as_per_norm_85: number = 0;
  total_hq_att: number = 0;
  total_hq_ab_coverage: number = 0;

  /**
   * User Component Constructor
   */
  constructor(public _service: AuthService, public route: ActivatedRoute, public reportService: ReportService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * Chart data
   */
  fetch() {
    if (this._regions && this._regions.length > 0) {
      Observable.forkJoin(
        this.reportService.pob(this._month + 1, this._year),
        this.reportService.ff_effort_metrics(this._month + 1, this._year)
      ).subscribe(data => {

        // get targets monthly
        let orders = data[0].orders.map(order => new Order(order));
        let visits = data[0].visits.map(visit => new Visit(visit));
        let attendances = data[0].attendances.map(att => new Attendance(att));
        let customers = data[0].customers.map(cus => new Customer(cus));
        let ab_customers = data[1].customers.map(cus => new Customer(cus));
        let ab_visits = data[1].visits.map(visit => new Visit(visit));

        this.prepareData(orders, visits, attendances, customers, ab_customers, ab_visits);
      });
    }
  }

  /**
   * Prepare data for primary sales
   * @param orders
   * @param visits
   * @param attendances
   * @param customers
   * @param ab_customers
   * @param ab_visits
   */
  prepareData(orders: Order[], visits: Visit[], attendances: Attendance[], customers: Customer[], ab_customers: Customer[],
              ab_visits: Visit[]) {
    this.total_hq = 0;
    this.total_pob_to_30_target = 0;
    this.hq_on_target_count = 0;
    this.total_visits = 0;
    this.total_att = 0;
    this.total_hq_above_call_average = 0;
    this.total_hq_att_as_per_norm_23 = 0;
    this.total_hq_att_as_per_norm_85 = 0;
    this.total_hq_att = 0;
    this.total_hq_ab_coverage = 0;
    this._regions.map(region => {
      region.total_pob = 0;
      region.total_visit = 0;
      region.total_visit_ab = 0;
      region.total_att = 0;
      region.total_customers = 0;
      region.total_customers_ab = 0;
      region.areas.map(area => {
        area.headquarters.map(headquarter => {
          this.total_hq += 1;
          headquarter.total_pob = 0;
          headquarter.total_visit = 0;
          headquarter.total_visit_ab = 0;
          headquarter.total_att = 0;
          headquarter.total_customers = 0;
          headquarter.total_customers_ab = 0;


          // add orders to total pobs
          orders.map(ord => {
            if (ord.hq_headquarter_id == headquarter.id) {
              headquarter.total_pob += ord.order_total_count;
              region.total_pob += ord.order_total_count;
            }
          });

          // add total visits to individual hq
          visits.map(visit => {
            if (visit.hq_headquarter_id == headquarter.id) {
              headquarter.total_visit += visit.visit_count;
              region.total_visit += visit.visit_count;
            }
          });

          // add total attendances to individual hq
          attendances.map(att => {
            if (att.hq_headquarter_id == headquarter.id) {
              headquarter.total_att += att.att_count;
              region.total_att += att.att_count;
            }
          });

          // add customers  to individual hq
          customers.map(cus => {
            if (cus.hq_headquarter_id == headquarter.id) {
              headquarter.total_customers += cus.visit_count;
              region.total_customers += cus.visit_count;
            }
          });

          // add ab customers  to individual hq
          ab_customers.map(cus => {
            if (cus.hq_headquarter_id == headquarter.id) {
              headquarter.total_customers_ab += cus.visit_count;
              region.total_customers_ab += cus.visit_count;
            }
          });

          // add ab customers  to individual hq
          ab_visits.map(vis => {
            if (vis.hq_headquarter_id == headquarter.id) {
              headquarter.total_visit_ab += vis.visit_count;
              region.total_visit_ab += vis.visit_count;
            }
          });
        });
      });

      this.total_pob_to_30_target += region.targetTo30;
      this.hq_on_target_count += region.hqAboveTarget;
      this.total_visits += region.total_visit;
      this.total_att += region.total_att;
      this.total_hq_att += region.total_att;
      this.total_hq_above_call_average += region.hqAboveCallAverage;
      this.total_hq_att_as_per_norm_23 += region.totalHqAttAsPerNorm23;
      this.total_hq_att_as_per_norm_85 += region.totalHqCoverageAsPerNorm85;
      this.total_hq_ab_coverage += region.totalHqCoverage;
    });
  };
}
