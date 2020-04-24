import {Component, Input} from "@angular/core";
import {GoogleChartComponent} from "../../../base/google_chart.component";
import {ReportService} from "../../../../services/report.service";
import {Visit} from "../../../../models/visit/visit";
import {AuthService} from "../../../../services/AuthService";
import * as moment from "moment";
import {PrimarySale} from "../../../../models/sale/primary_sale";
import {Target} from "../../../../models/SAP/target";
import {AppConstants} from '../../../../app.constants';

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

  public upto_7th_rep_count: number = 0;
  public upto_14th_rep_count: number = 0;
  public upto_21th_rep_count: number = 0;
  public upto_28th_rep_count: number = 0;

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
    if ((self.month || self.month == 0) && self.year) {
      self.loading = true;
      self.reportService.milestone_sales_tracking_chart(self._region_ids, self._area_ids, self._headquarter_ids, self.month + 1, self.year,
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
  constructor(private reportService: ReportService, public _service: AuthService) {
    super(_service);
  }

  ngOnInit() {
    super.ngOnInit();
    this.fetchMilestone();
    let current_month = moment();
    this.month = current_month.month();
    this.year = current_month.year();
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
    this.upto_7th_rep_count = 0;
    this.upto_14th_rep_count = 0;
    this.upto_21th_rep_count = 0;
    this.upto_28th_rep_count = 0;

    // map target
    targets.map(target => {

      // map primary sales
      primary_sales.map(primary_sale => {
        let sale_20_per = 0;
        let sale_40_per = 0;
        let sale_60_per = 0;
        let sale_100_per = 0;
        // target amd primary sale headquarter
        if (target.hq_headquarter_id == primary_sale.hq_headquarter_id) {

          // target
          if (target.total_target > 0) {
            sale_20_per = parseInt(((primary_sale.upto_7th_sale / target.total_target) * 100).toFixed(0));
            sale_40_per = parseInt(((primary_sale.upto_14th_sale / target.total_target) * 100).toFixed(0));
            sale_60_per = parseInt(((primary_sale.upto_21th_sale / target.total_target) * 100).toFixed(0));
            sale_100_per = parseInt(((primary_sale.upto_28th_sale / target.total_target) * 100).toFixed(0));
          }
        }
        if (sale_20_per >= 20)
          this.upto_7th_rep_count += 1;

        if (sale_40_per >= 40)
          this.upto_14th_rep_count += 1;

        if (sale_60_per >= 60)
          this.upto_21th_rep_count += 1;

        if (sale_100_per >= 100)
          this.upto_28th_rep_count += 1;
      });
    });

    data.push(['7th (20%)', this.upto_7th_rep_count]);
    data.push(['14th (40%)', this.upto_14th_rep_count]);
    data.push(['21th (60%)', this.upto_21th_rep_count]);
    data.push(['29th (100%)', this.upto_28th_rep_count]);

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
      this.month + 1, this.year).subscribe(
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
