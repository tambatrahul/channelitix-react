import {Component, Input} from "@angular/core";
import {GoogleChartComponent} from "../../../base/google_chart.component";
import {ReportService} from "../../../../services/report.service";
import {Performance} from "../../../../models/SAP/performance";
import {AuthService} from "../../../../services/AuthService";
import * as moment from "moment";
import {AppConstants} from '../../../../app.constants';
import {Visit} from '../../../../models/visit/visit';
import {Order} from '../../../../models/order/order';
import {Attendance} from '../../../../models/attendance/attendance';
import { forEach } from "@angular/router/src/utils/collection";
import { V2ReportService } from "app/services/v2/report.service";

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
   * Product Id
   */
  public product_id: number = 0;
  public brand_id: number = 0;
  public sub_name: string;

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

  _department_id: number = 0;
  @Input()
  set department_id(department_id: number) {
    this._department_id = department_id;
    this.fetchPerformance();
  }

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetchPerformance();
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
    this.fetchPerformance();
  }

  /**
   * region id for filter
   */
  _zone_ids: Array<number> = [];
  @Input()
  set zone_ids(zone_ids) {
    this._zone_ids = zone_ids;
    this.fetchPerformance();
  };

  /**
   * region id for filter
   */
  _region_ids: Array<number> = [];
  @Input()
  set region_ids(region_ids) {
    this._region_ids = region_ids;
    this.fetchPerformance();
  };

  /**
   * area id for filter
   */
  _area_ids: Array<number> = [];
  @Input()
  set area_ids(area_ids) {
    this._area_ids = area_ids;
    this.fetchPerformance();
  };

  /**
   * headquarter id for filter
   */
  _headquarter_ids: Array<number> = [];
  @Input()
  set headquarter_ids(headquarter_ids) {
    this._headquarter_ids = headquarter_ids;
    this.fetchPerformance();
  };

  /**
   * Chart data
   */
  fetchPerformance = AppConstants.debounce(function () {
    const self = this;
      self.loading = true;
      self.reportService.performanceSummary(self._region_ids, self._area_ids, self._headquarter_ids, self._zone_ids, self.sub_name, self.brand_id, self._department_id).subscribe(
        response => {
          self.loading = false;
          self.prepareData(new Performance(response.performance));
        },
        err => {
          self.loading = false;
        }
      );
  }, 1000, false);

  /**
   *
   */
  constructor(private reportService: V2ReportService, public _service: AuthService) {
    super(_service);
  }

  ngOnInit() {
    super.ngOnInit();
    this.current_date = moment();
    this.fetchPerformance();
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

      //console.log(data);

      let new_current_date = moment(this.current_date).subtract(14, 'months');
      let current_month = moment(this.current_date).month();
/*
      console.log(new_current_date);
      console.log(new_current_date.format('MMM'));
      console.log(parseInt(new_current_date.format('MMM'))); */

      let new_data = {};
      for (let i = 1; i <= 15; i++) {
        new_data[parseInt(new_current_date.format('YYYYMM'))+ "_" + new_current_date.format('MMM')] = {};
        new_current_date.add(1, 'month').format("DD/MM/YYYY");
      }

      // add target to object
      performance.primary_secondary_sales_and_targets.forEach(function (t) {
       new_data[t.month_year + "_" + moment(t.month_year.toString().slice(4), 'M').format('MMM')] = {
        target: parseFloat((t.total_target/ 1000).toFixed(2)),
        primary: 0,
        secondary: 0
      }
    });

    // add primary sale to object
    performance.primary_secondary_sales_and_targets.forEach(function (ps) {
      if (!new_data.hasOwnProperty(ps.month_year + "_" + moment(ps.month_year.toString().slice(4), 'M').format('MMM'))) {
        new_data[ps.month_year + "_" + moment(ps.month_year.toString().slice(4), 'M').format('MMM')] = {
          target: 0,
          primary: parseFloat((ps.total_net_amt / 1000).toFixed(2)),
          secondary: 0
        };
      } else
        new_data[ps.month_year + "_" + moment(ps.month_year.toString().slice(4), 'M').format('MMM')].primary = parseFloat((ps.total_net_amt / 1000).toFixed(2))
    });

    performance.primary_secondary_sales_and_targets.forEach(function (ss) {
      if (!new_data.hasOwnProperty(ss.month_year + "_" + moment(ss.month_year.toString().slice(4), 'M').format('MMM'))) {
        new_data[ss.month_year + "_" + moment(ss.month_year.toString().slice(4), 'M').format('MMM')] = {
          target: 0,
          primary: 0,
          secondary: parseFloat((ss.total_secondary_sales / 1000).toFixed(2))
        };
      } else
        new_data[ss.month_year + "_" + moment(ss.month_year.toString().slice(4), 'M').format('MMM')].secondary = parseFloat((ss.total_secondary_sales / 1000).toFixed(2));
    });

      // prepare data
      let prepared_data = [];
      for (let key in new_data) {
        prepared_data.push([key.replace(/[\d_]+/g, ' ').replace(/[-]/g, ' '), new_data[key].target,
          new_data[key].primary, new_data[key].secondary]);
      }

      // prepared data
      data.addRows(prepared_data);

      // set chart data
      this.chart_data = data;
      // set chart data callback
      this.drawGraph();

    });
  }

    /**
     * subname Filter
     *
     * @param sub_name
     */
    subnameChanged(sub_name) {
      this.sub_name = sub_name;
      this.fetchPerformance();
    }
}
