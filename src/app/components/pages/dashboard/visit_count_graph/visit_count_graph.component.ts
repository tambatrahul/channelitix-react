import { Component, EventEmitter, Input, Output } from "@angular/core";
import { GoogleChartComponent } from "../../../base/google_chart.component";
import { ReportService } from "../../../../services/report.service";
import { Order } from "../../../../models/order/order";
import { Visit } from "../../../../models/visit/visit";
import { Attendance } from "../../../../models/attendance/attendance";
import { AuthService } from "../../../../services/AuthService";
import { AppConstants } from '../../../../app.constants';
import { Performance } from '../../../../models/SAP/performance';
import * as moment from 'moment';
import { Product } from '../../../../models/order/product';
import { V2ReportService } from "app/services/v2/report.service";
import { Summary } from "app/models/V2/SAP/summary";

declare let jQuery: any;
declare let d3: any;

@Component({
  selector: 'visit-count-graph',
  styleUrls: ['visit_count_graph.component.less'],
  templateUrl: 'visit_count_graph.component.html',
  inputs: ['refresh']
})
export class VisitCountGraphComponent extends GoogleChartComponent {

  /**
   * total visit and total pob
   * @type {number}
   */
  public total_visits: number = 0;
  public total_pob: number = 0;
  public total_pob_sk: number = 0;
  public total_pob_synergy: number = 0;
  public totalOrders: number = 0;
  public totalInputDistribution: number = 0;
  public totalPrimarySalesAndTarget: Summary[];
  public iconPobToSalesRate: number = 0;
  public chlPobToSalesRate: number = 0;
  public pobToSalesRate: number = 0;

  /**
   * Product Id
   */
  public product_id: number = 0;
  public brand_id: number = 0;

  /**
   * year and month for calendar
   * @type {number}
   */
  public _month: number;
  public _year: number;


  @Input()
  set month_(month: number) {
    this._month = month;
    this.fetchVisitOrdreTrend();
  }

  @Input()
  set year_(year: number) {
    this._year = year;
    this.fetchVisitOrdreTrend();
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
    this.fetchVisitOrdreTrend();
  }

  _department_id: number = 0;
  @Input()
  set department_id(department_id: number) {
    this._department_id = department_id;
    this.brand_id = 0;
    this.fetchVisitOrdreTrend();
  }

  /**
   * region id for filter
   */
  _zone_ids: Array<number> = [];
  @Input()
  set zone_ids(zone_ids) {
    this._zone_ids = zone_ids;
    this.fetchVisitOrdreTrend();
  };

  /**
   * region id for filter
   */
  _region_ids: Array<number> = [];
  @Input()
  set region_ids(region_ids) {
    this._region_ids = region_ids;
    this.fetchVisitOrdreTrend();
  };

  /**
   * area id for filter
   */
  _area_ids: Array<number> = [];
  @Input()
  set area_ids(area_ids) {
    this._area_ids = area_ids;
    this.fetchVisitOrdreTrend();
  };

  /**
   * headquarter id for filter
   */
  _headquarter_ids: Array<number> = [];
  @Input()
  set headquarter_ids(headquarter_ids) {
    this._headquarter_ids = headquarter_ids;
    this.fetchVisitOrdreTrend();
  };


  /**
   * return total visit and orders
   * @type {EventEmitter}
   */
  @Output()
  totalVisitOrders = new EventEmitter();

  /**
   * Chart options
   */
  @Input()
  public options;

  /**
   * data for chart
   */
  public chart_data = [];

  /**
   * chart and data
   */
  private data;
  private chart;

  /**
   * dates
   *
   * @type {}
   */
  _dates: {
    from_date: '',
    to_date: '',
    year: ''
  };
  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetchVisitOrdreTrend();
  }

  /**
   * visit and order arrays
   *
   * @type {Array}
   */
  visits: Visit[] = [];
  orders: Order[] = [];
  attendances: Attendance[] = [];

  /**
   * Chart data
   */
  fetchVisitOrdreTrend = AppConstants.debounce(function () {
    const self = this;
    if ((self._month || self._month == 0) && self._year) {
      self.loading = true;
      self.reportService.visit_order_trend(self._month + 1, self._year,
        self._region_ids, self._area_ids, self._headquarter_ids, self.product_id, self.brand_id, self._zone_ids, self._department_id).subscribe(
          response => {
            self.visits = response.visits.map(function (visit) {
              return new Visit(visit);
            });
            self.orders = response.orders.map(function (order) {
              return new Order(order);
            });

            self.total_pob_sk = response.orders_sk;
            self.total_pob_synergy = response.orders_synergy;

            self.attendances = response.attendances.map(function (att) {
              return new Attendance(att);
            });

            self.totalOrders = response.total_orders;
            self.totalInputDistribution = response.total_input_distribution;

            self.totalPrimarySalesAndTarget = response.total_primary_sales_and_target.map(function (tpst) {
              return new Summary(tpst);
            });

            self.totalPrimarySalesAndTarget.map(function (pobRate) {
              if (pobRate.department == 'Icon') {
                self.iconPobToSalesRate = pobRate.pobToSalesRate;
              }

              if (pobRate.department == 'CHL') {
                self.chlPobToSalesRate = pobRate.pobToSalesRate;
              }

              if (pobRate.department != 'Icon' && pobRate != 'CHL') {
                self.pobToSalesRate = pobRate.pobToSalesRate;
              }
            });

            self.getGoogle().charts.setOnLoadCallback(() => {
              self.prepareData();
            });
            self.loading = false;
          },
          err => {
            self.loading = false;
          }
        );
    }
  }, 1000, false);

  /**
   *
   */
  constructor(private reportService: V2ReportService, public _service: AuthService) {
    super(_service);
  }

  ngOnInit() {
    super.ngOnInit();
    this.fetchVisitOrdreTrend();
  }

  /**
 * draw graph
 */
  drawGraph() {
    this.data = this.createDataTable(this.chart_data);

    this.options = {
      chartArea: { left: 60, top: 40, bottom: 40, right: 20, width: "100%", height: "100%" },
      title: '',
      hAxis: {
        title: 'Date',
        minValue: 1
      },
      seriesType: 'bars',
      vAxes: [
        { title: 'Visit', minValue: 0, viewWindow: { min: 0 } },
        { title: 'POB in (₹)', viewWindow: { min: 0 } }
      ],
      bar: {
        groupWidth: '80%'
      },
      series: [
        { axis: 0, type: 'bar', targetAxisIndex: 0 },
        { axis: 1, type: 'line', targetAxisIndex: 1 }
      ]
    };

    this.chart = this.createComboChar(document.getElementById('chart_divEvolution'));
    this.chart.draw(this.data, this.options);
  }

  /**
   * Chart data
   */
  fetch() {

  }

  /**
   * prepare data for graph
   */
  prepareData() {
    let data = [];
    data.push(['Date', 'Visit', 'POB in (₹)']);

    let data_object = {};
    this.attendances.forEach(function (att) {
      data_object[String(att.att_day) + '/' + String(att.att_month)] = {
        visit_count: 0,
        order_count: 0,
        att_count: att.att_count
      };
    });

    // add visit to data
    this.visits.forEach(function (visit) {
      if (data_object.hasOwnProperty(String(visit.visit_day) + '/' + String(visit.visit_month)))
        data_object[String(visit.visit_day) + '/' + String(visit.visit_month)].visit_count = visit.visit_count;
    });

    // add order to data
    this.orders.forEach(function (order) {
      if (data_object.hasOwnProperty(String(order.order_day) + '/' + String(order.order_month)))
        data_object[String(order.order_day) + '/' + String(order.order_month)].order_count = order.total_pob;
    });

    this.chart_data = [];
    this.total_visits = 0;
    this.total_pob = 0;
    for (let key in data_object) {
      data.push([
        key,
        data_object[key].visit_count,
        data_object[key].order_count
      ]);
      this.total_visits += data_object[key].visit_count;
      this.total_pob += data_object[key].order_count;
    }

    // set chart data
    this.chart_data = data;

    // set total visit and order
    this.totalVisitOrders.emit({
      'visits': this.total_visits,
      'orders': this.total_pob,
      'totalOrders': this.totalOrders,
      'totalInputDistribution': this.totalInputDistribution,
      'chlPobToSalesRate': this.chlPobToSalesRate,
      'iconPobToSalesRate': this.iconPobToSalesRate,
      'pobToSalesRate': this.pobToSalesRate
    });

    // set chart data callback
    this.getGoogle().charts.setOnLoadCallback(() => this.drawGraph());
  }

  /**
   * product Filter
   *
   * @param product_id
   */
  productChanged(product_id) {
    this.product_id = product_id;
    this.fetchVisitOrdreTrend();
  }

  /**
   * brand Filter
   *
   * @param brand_id
   */
  brandChanged(brand_id) {
    this.brand_id = brand_id;
    this.fetchVisitOrdreTrend();
  }
}
