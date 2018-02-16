import {Component, Input} from "@angular/core";
import {GoogleChartComponent} from "../../../base/google_chart.component";
import {ReportService} from "../../../../services/report.service";
import {Performance} from "../../../../models/SAP/performance";
import {AuthService} from "../../../../services/AuthService";
import * as moment from "moment";

declare let jQuery: any;
declare let d3: any;

@Component({
  selector: 'monthly-primary-secondary-target',
  styleUrls: ['monthly_primary_secondary_target.component.less'],
  templateUrl: 'monthly_primary_secondary_target.component.html',
  inputs: ['refresh']
})
export class MonthlyPrimarySecondaryTargetComponent extends GoogleChartComponent {
  /**
   * data for chart
   */
  public chart_data;
  public current_date;

  /**
   * chart and data
   */
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
   * region id for filter
   */
  _region_ids: Array<number> = [];
  @Input()
  set region_ids(region_ids) {
    this._region_ids = region_ids;
    this.fetch();
  };

  /**
   * area id for filter
   */
  _area_ids: Array<number> = [];
  @Input()
  set area_ids(area_ids) {
    this._area_ids = area_ids;
    this.fetch();
  };

  /**
   * headquarter id for filter
   */
  _headquarter_ids: Array<number> = [];
  @Input()
  set headquarter_ids(headquarter_ids) {
    this._headquarter_ids = headquarter_ids;
    this.fetch();
  };

  /**
   *
   */
  constructor(private reportService: ReportService, public _service: AuthService) {
    super(_service);
  }

  ngOnInit() {
    super.ngOnInit();
    this.current_date = moment();
    this.fetch();
  }

  /**
   * draw graph
   */
  drawGraph() {

    let options = {
      chartArea: {left: 60, top: 40, bottom: 40, right: 40, width: "100%", height: "100%"},
      legend: {position: 'top', alignment: 'start'},
      hAxis: {
        title: 'Month'
      },
      vAxis: {
        title: 'Sales'
      },
      colors: ['#097138', '#e67e22', '#3366cc']
    };

    this.chart = this.createLineChart(document.getElementById('p_s_t_sales'));
    this.chart.draw(this.chart_data, options);
  }

  /**
   * Chart data
   */
  fetch() {
    this.loading = true;
    this.reportService.performance(this._region_ids, this._area_ids, this._headquarter_ids).subscribe(
      response => {
        this.loading = false;
        this.prepareData(new Performance(response.performance));
      },
      err => {
        this.loading = false;
      }
    );
  }

  /**
   * prepare data for graph
   */
  prepareData(performance: Performance) {
    this.getGoogle().charts.setOnLoadCallback(() => {
      let google = this.getGoogle();
      let data = new google.visualization.DataTable();
      data.addColumn('string', 'Months');
      data.addColumn('number', 'Targets');
      data.addColumn('number', 'Primary Sales');
      data.addColumn('number', 'Secondary Sales');
      // data.addColumn('number', 'Closing');

      let new_current_date = moment(this.current_date).subtract(11, 'months');
      let current_month = moment(this.current_date).month();

      let new_data = {};
      for (let i = 1; i <= 12; i++) {
        new_data[parseInt(new_current_date.format('M')) - (current_month + 2) + "_" + new_current_date.format('MMM')] = {};
        new_current_date.add(1, 'month').format("DD/MM/YYYY");
      }


      // add target to object
      performance.targets.forEach(function (target) {
        new_data[target.month - (current_month + 2) + "_" + moment(target.month, 'M').format('MMM')] = {
          target: parseFloat((target.total_target / 1000).toFixed(2)),
          primary: 0,
          secondary: 0
        };
      });

      // add primary sale to object
      performance.primary_sales.forEach(function (ps) {
        if (!new_data.hasOwnProperty(ps.month - (current_month + 2) + "_" + moment(ps.month, 'M').format('MMM'))) {
          new_data[ps.month - (current_month + 2) + "_" + moment(ps.month, 'M').format('MMM')] = {
            target: 0,
            primary: parseFloat((ps.total_net_amount / 1000).toFixed(2)),
            secondary: 0
          };
        } else
          new_data[ps.month - (current_month + 2) + "_" + moment(ps.month, 'M').format('MMM')].primary = parseFloat((ps.total_net_amount / 1000).toFixed(2))
      });

      performance.secondary_sales.forEach(function (ss) {
        if (!new_data.hasOwnProperty(ss.month - (current_month + 2) + "_" + moment(ss.month, 'M').format('MMM'))) {
          new_data[ss.month - (current_month + 2) + "_" + moment(ss.month, 'M').format('MMM')] = {
            target: 0,
            primary: 0,
            secondary: parseFloat((ss.total_amount / 1000).toFixed(2))
          };
        } else
          new_data[ss.month - (current_month + 2) + "_" + moment(ss.month, 'M').format('MMM')].secondary = parseFloat((ss.total_amount / 1000).toFixed(2));
      });

      // prepare data
      let prepared_data = [];
      for (let key in new_data) {
        prepared_data.push([key.replace(/[0-9]_/g, ' ').replace(/[-]/g, ' '), new_data[key].target,
          new_data[key].primary, new_data[key].secondary])
      }

      // prepared data
      data.addRows(prepared_data);

      // set chart data
      this.chart_data = data;

      // set chart data callback
      this.drawGraph();
    });

  }
}
