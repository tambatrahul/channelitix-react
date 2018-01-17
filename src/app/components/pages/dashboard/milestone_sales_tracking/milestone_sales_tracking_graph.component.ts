import {Component, Input} from "@angular/core";
import {GoogleChartComponent} from "../../../base/google_chart.component";
import {ReportService} from "../../../../services/report.service";
import {Visit} from "../../../../models/visit/visit";
import {AuthService} from "../../../../services/AuthService";
import * as moment from "moment";
import {PrimarySale} from "../../../../models/sale/primary_sale";
import {Target} from "../../../../models/SAP/target";

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
    this.fetch();
  }

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

  public upto_9th_rep_count: number = 0;
  public upto_18th_rep_count: number = 0;
  public upto_24th_rep_count: number = 0;
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
  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  /**
   *
   */
  constructor(private reportService: ReportService, public _service: AuthService) {
    super(_service);
  }

  ngOnInit() {
    super.ngOnInit();
    this.fetch();
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
    if ((this.month || this.month == 0) && this.year) {
      this.loading = true;
      this.reportService.milestone_sales_tracking_chart(this._region_ids, this._area_ids, this._headquarter_ids, this.month + 1, this.year).subscribe(
        response => {
          let primary_sales = response.primary_sales.map(pr => new PrimarySale(pr));
          let targets = response.targets.map(tr => new Target(tr));

          this.getGoogle().charts.setOnLoadCallback(() => {
            this.prepareData(targets, primary_sales);
          });
          this.loading = false;
        },
        err => {
          this.loading = false;
        });
    }
  }

  /**
   * prepare data for graph
   */
  prepareData(targets: Target[], primary_sales: PrimarySale[]) {
    let data = [];
    data.push(['Date', 'No of Reps']);
    this.upto_9th_rep_count = 0;
    this.upto_18th_rep_count = 0;
    this.upto_24th_rep_count = 0;
    this.upto_28th_rep_count = 0;

    // map target
    targets.map(target => {

      // map primary sales
      primary_sales.map(primary_sale => {

        // target amd primary sale headquarter
        if (target.hq_headquarter_id == primary_sale.hq_headquarter_id) {

          // target
          if (target.total_target > 0) {
            let sale_20_per = ((primary_sale.upto_9th_sale / target.total_target) * 100).toFixed(0);
            let sale_40_per = ((primary_sale.upto_18th_sale / target.total_target) * 100).toFixed(0);
            let sale_60_per = ((primary_sale.upto_24th_sale / target.total_target) * 100).toFixed(0);
            let sale_100_per = ((primary_sale.upto_28th_sale / target.total_target) * 100).toFixed(0);

            if (parseInt(sale_20_per) >= 20)
              this.upto_9th_rep_count += 1;

            if (parseInt(sale_40_per) >= 40)
              this.upto_18th_rep_count += 1;

            if (parseInt(sale_60_per) >= 60)
              this.upto_24th_rep_count += 1;

            if (parseInt(sale_100_per) >= 100)
              this.upto_28th_rep_count += 1;
          }
        }
      });
    });

    data.push(['9th (20%)', this.upto_9th_rep_count]);
    data.push(['18th (40%)', this.upto_18th_rep_count]);
    data.push(['24th (60%)', this.upto_24th_rep_count]);
    data.push(['28th (100%)', this.upto_28th_rep_count]);

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
    this.fetch();
  }
}
