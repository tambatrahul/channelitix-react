import {Component, EventEmitter, Input, Output} from "@angular/core";
import {GoogleChartComponent} from "../../../base/google_chart.component";
import {ReportService} from "../../../../services/report.service";
import {Order} from "../../../../models/order/order";
import {Visit} from "../../../../models/visit/visit";
import {Attendance} from "../../../../models/attendance/attendance";
import {AuthService} from "../../../../services/AuthService";

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
  public total_orders: number = 0;

  /**
   * Product Id
   */
  public product_id: number = 0;
  public brand_id: number = 0;

  /**
   * view quantity
   *
   * @type {number}
   * @private
   */
  _refresh: boolean;
  set refresh(refresh) {
    this._refresh = refresh;
    this.fetch();
  }

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
    this.fetch();
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
   *
   */
  constructor(private reportService: ReportService, public _service: AuthService) {
    super(_service);
  }

  ngOnInit() {
    super.ngOnInit();
    this.fetch();
  }

  /**
   * draw graph
   */
  drawGraph() {
    this.data = this.createDataTable(this.chart_data);

    this.options = {
      chartArea: {left: 60, top: 40, bottom: 40, right: 20, width: "100%", height: "100%"},
      title: '',
      hAxis: {
        title: 'Date',
        minValue: 1
      },
      seriesType: 'bars',
      vAxes: [
        {title: 'Visit', minValue: 0, viewWindow: {min: 0}},
        {title: 'POB in (₹)', viewWindow: {min: 0}}
      ],
      bar: {
        groupWidth: '80%'
      },
      series: [
        {axis: 0, type: 'bar', targetAxisIndex: 0},
        {axis: 1, type: 'line', targetAxisIndex: 1}
      ]
    };

    this.chart = this.createComboChar(document.getElementById('chart_divEvolution'));
    this.chart.draw(this.data, this.options);
  }

  /**
   * Chart data
   */
  fetch() {
    if (this._dates && this._dates.from_date && this._dates.to_date) {
      this.loading = true;
      this.reportService.visit_order_trend(this._dates.from_date, this._dates.to_date, this._dates.year,
        this._region_ids, this._area_ids, this._headquarter_ids, this.product_id, this.brand_id).subscribe(
        response => {
          this.visits = response.visits.map(function (visit) {
            return new Visit(visit);
          });
          this.orders = response.orders.map(function (order) {
            return new Order(order);
          });

          this.total_pob_sk = response.orders_sk;
          this.total_pob_synergy = response.orders_synergy;

          this.attendances = response.attendances.map(function (att) {
            return new Attendance(att);
          });

          this.total_orders = response.total_orders;

          this.getGoogle().charts.setOnLoadCallback(() => {
            this.prepareData();
          });
          this.loading = false;
        },
        err => {
          this.loading = false;
        }
      )
    }
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
        data_object[String(order.order_day) + '/' + String(order.order_month)].order_count = order.order_day_total_count;
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
      'total_orders': this.total_orders,
      'orders_sk': this.total_pob_sk,
      'orders_synergy': this.total_pob_synergy
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
    this.fetch();
  }

  /**
   * brand Filter
   *
   * @param brand_id
   */
  brandChanged(brand_id) {
    this.brand_id = brand_id;
    this.fetch();
  }
}
