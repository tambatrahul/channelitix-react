import {Component, Input} from "@angular/core";
import {GoogleChartComponent} from "../../../base/google_chart.component";
import {ReportService} from "../../../../services/report.service";
import {Visit} from "../../../../models/visit/visit";
import {AuthService} from "../../../../services/AuthService";
import * as moment from "moment";
import {PrimarySale} from "../../../../models/sale/primary_sale";
import {Target} from "../../../../models/SAP/target";
import {AppConstants} from '../../../../app.constants';
import { V2ReportService } from "app/services/v2/report.service";

declare let jQuery: any;
declare let d3: any;

@Component({
  selector: 'milestone-sales-tracking-graph',
  styleUrls: ['milestone_sales_tracking_graph.component.less'],
  templateUrl: 'milestone_sales_tracking_graph.component.html',
  inputs: ['refresh']
})
export class MilestoneSaleTrackingGraphComponent extends GoogleChartComponent {

  month: number;
  year: number;

  /**
   * year and month for calendar
   * @type {number}
   */
  public _month: number;
  public _year: number;


  @Input()
  set month_(month: number) {
    this._month = month;
    this.fetchMilestone();
  }

  @Input()
  set year_(year: number) {
    this._year = year;
    this.fetchMilestone();
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
    this.fetchMilestone();
  }

  /**
   * zone id for filter
   */
  _zone_ids: Array<number> = [];
  @Input()
  set zone_ids(zone_ids) {
    this._zone_ids = zone_ids;
    this.fetchMilestone();
  };

  /**
   * region id for filter
   */
  _region_ids: Array<number> = [];
  @Input()
  set region_ids(region_ids) {
    this._region_ids = region_ids;
    this.fetchMilestone();
  };

  /**
   * area id for filter
   */
  _area_ids: Array<number> = [];
  @Input()
  set area_ids(area_ids) {
    this._area_ids = area_ids;
    this.fetchMilestone();
  };

  /**
   * headquarter id for filter
   */
  _headquarter_ids: Array<number> = [];
  @Input()
  set headquarter_ids(headquarter_ids) {
    this._headquarter_ids = headquarter_ids;
    this.fetchMilestone();
  };

  /**
   * Chart options
   */
  @Input()
  public options;

  /**
   * data for chart
   */
  public chart_data = [];

  public btn_loading: boolean = false;

  /**
   * chart and data
   */
  private data;
  private chart;

  public total_net_amt_till_10th: number = 0;
  public total_net_amt_till_20th: number = 0;
  public total_net_amt_till_31th: number = 0;

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

  _department_id: number = 0;
  @Input()
  set department_id(department_id: number) {
    this._department_id = department_id;
    this.fetchMilestone();
  }

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetchMilestone();
  }

  /**
   * Chart data
   */
  fetchMilestone = AppConstants.debounce(function () {
    const self = this;
    if ((self._month || self._month == 0) && self._year) {
      self.loading = true;
      self.v2ReportService.milestone_sales_tracking_chart(self._region_ids, self._area_ids, self._headquarter_ids, self._month + 1, self._year,
        self._zone_ids, self._department_id).subscribe(
        response => {
          let primary_sales = response.primary_sales.map(pr => new PrimarySale(pr));
          let targets = response.targets.map(tr => new Target(tr));

          self.getGoogle().charts.setOnLoadCallback(() => {
            self.prepareData(targets, primary_sales);
          });
          self.loading = false;
        },
        err => {
          self.loading = false;
        });
    }
  }, 1000, false);


  /**
   *
   */
  constructor(private reportService: ReportService, public _service: AuthService, private v2ReportService: V2ReportService) {
    super(_service);
  }

  ngOnInit() {
    super.ngOnInit();
    this.fetchMilestone();
    let current_month = moment();
    this._month = current_month.month();
    this._year = current_month.year();
  }

  /**
   * draw graph
   */
  drawGraph() {
    this.data = this.createDataTable(this.chart_data);

    this.options = {
      chartArea: {left: 60, top: 40, bottom: 40, right: 20, width: "100%", height: "100%"},
      legend: {position: 'top', alignment: 'start'},
      title: '',
      hAxis: {
        title: 'Date',
        minValue: 1
      },
      seriesType: 'bars',
      vAxes: [{
        title: 'No of Reps',
        minValue: 0,
        viewWindow: {min: 0}
      }],
      bar: {
        groupWidth: '80%'
      },
      series: [
        {axis: 0, type: 'bar', targetAxisIndex: 0}
      ]
    };

    this.chart = this.createComboChar(document.getElementById('milestoneTracking'));
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
  prepareData(targets: Target[], primary_sales: PrimarySale[]) {
    let data = [];
    data.push(['Date', 'No of Reps']);
    this.total_net_amt_till_10th = 0;
    this.total_net_amt_till_20th = 0;
    this.total_net_amt_till_31th = 0;

    // map target
    targets.map(target => {

      // map primary sales
      primary_sales.map(primary_sale => {
        let sale_25_per = 0;
        let sale_60_per = 0;
        let sale_100_per = 0;
        // target amd primary sale headquarter
        if (target.hq_headquarter_id == primary_sale.hq_headquarter_id) {

          // target
          if (target.total_target > 0) {
            sale_25_per = parseInt(((primary_sale.total_net_amt_till_10th / target.total_target) * 100).toFixed(0));
            sale_60_per = parseInt(((primary_sale.total_net_amt_till_20th / target.total_target) * 100).toFixed(0));
            sale_100_per = parseInt(((primary_sale.total_net_amt_till_31th / target.total_target) * 100).toFixed(0));
          }
        }
        if (sale_25_per >= 25)
          this.total_net_amt_till_10th += 1;

        if (sale_60_per >= 60)
          this.total_net_amt_till_20th += 1;

        if (sale_100_per >= 100)
          this.total_net_amt_till_31th += 1;
      });
    });

    data.push(['10th (25%)', this.total_net_amt_till_10th]);
    data.push(['20th (60%)', this.total_net_amt_till_20th]);
    data.push(['30th (100%)', this.total_net_amt_till_31th]);

    this.chart_data = [];
    this.chart_data = data;

    // set chart data callback
    this.getGoogle().charts.setOnLoadCallback(() => this.drawGraph())
  }

  /**
   * month and year changed
   *
   * @param date
   */
  monthYearChanged(date) {
    let current_month = moment().month(date.month).year(date.year);
    this.month = current_month.month();
    this.year = current_month.year();
    this.fetchMilestone();
  }

  /**
   * Excel Download
   */
  excel_download() {
    this.btn_loading = true;
    this.reportService.milestone_sales_tracking_excel_download(this._region_ids, this._area_ids, this._headquarter_ids,
      this._month + 1, this._year).subscribe(
      response => {
        let blob: Blob = response.blob();

        // Doing it this way allows you to name the file
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "MilestoneSalesTracking.xls";
        link.click();
        this.btn_loading = false;
      },
      err => {
        this.btn_loading = false;
      });
  }
}
