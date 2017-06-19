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
  }

  /**
   * year of sale
   */
  public _year: number;
  @Input()
  set year(year: number) {
    this._year = year;
  }

  /**
   * get total pob to 30 percent of target
   * @type {number}
   */
  public total_hq = 0;
  total_pob_to_30_target: number = 0;
  hq_on_target_count: number = 0;
  total_visits: number = 0;
  total_att: number = 0;
  total_hq_above_call_average: number = 0;
  total_hq_att_as_per_norm_23: number = 0;

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
    Observable.forkJoin(
      this.reportService.pob(this._month + 1, this._year),
      this.reportService.ff_effort_metrics(this._month + 1, this._year)
    ).subscribe(data => {

      // get targets monthly
      let orders = data[0].orders.map(order => new Order(order));
      let visits = data[0].visits.map(visit => new Visit(visit));
      let attendances = data[0].attendances.map(att => new Attendance(att));

      this.prepareData(orders, visits, attendances);
    });
  }

  /**
   * Prepare data for primary sales
   * @param orders
   * @param visits
   * @param attendances
   */
  prepareData(orders: Order[], visits: Visit[], attendances: Attendance[]) {
    this.total_pob_to_30_target = 0;
    this.hq_on_target_count = 0;
    this.total_hq = 0;
    this._regions.map(region => {
      region.areas.map(area => {
        area.headquarters.map(headquarter => {

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

        });
      });
      this.total_hq += region.headquarters_count;
      this.total_pob_to_30_target +=  region.targetTo30;
      this.hq_on_target_count += region.hqAboveTarget;
      this.total_visits += region.total_visit;
      this.total_att += region.total_att;
      this.total_hq_above_call_average += region.hqAboveCallAverage;
      this.total_hq_att_as_per_norm_23 += region.totalHqAttAsPerNorm23;
    });
  };
}
