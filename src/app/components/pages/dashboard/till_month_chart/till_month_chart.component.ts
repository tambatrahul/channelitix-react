import {Component, Input} from "@angular/core";
import {GoogleChartComponent} from "../../../base/google_chart.component";
import {ReportService} from "../../../../services/report.service";
import {YearTillMonth} from "../../../../models/SAP/year_till_month";
import * as moment from "moment";
import {AuthService} from "../../../../services/AuthService";
import {AppConstants} from '../../../../app.constants';
import {Performance} from '../../../../models/SAP/performance';

declare let jQuery: any;
declare let d3: any;


@Component({
  selector: 'till-month-chart',
  styleUrls: ['till_month_chart.component.less'],
  templateUrl: 'till_month_chart.component.html',
  inputs: ['refresh']
})
export class TillMonthChartComponent extends GoogleChartComponent {

  /**
   * data for chart
   */
  public chart_data = [];

  /**
   * chart and data
   */
  private data;
  private chart;

  month_str: string;
  previous_month: string;
  month: number;
  year: number;

  /**
   * year and month for calendar
   * @type {number}
   */
  public _month: number;
  public _year: number;


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
    this.fetchTillMonthChart();
  }

  @Input()
  set month_(month: number) {
    this._month = month;
    this.fetchTillMonthChart();
  }

  @Input()
  set year_(year: number) {
    this._year = year;
    this.fetchTillMonthChart();
  }


  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetchTillMonthChart();
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
    this.fetchTillMonthChart();
  }

  /**
   * region id for filter
   */
  _zone_ids: Array<number> = [];
  @Input()
  set zone_ids(zone_ids) {
    this._zone_ids = zone_ids;
    this.fetchTillMonthChart();
  };

  /**
   * region id for filter
   */
  _region_ids: Array<number> = [];
  @Input()
  set region_ids(region_ids) {
    this._region_ids = region_ids;
    this.fetchTillMonthChart();
  };

  /**
   * area id for filter
   */
  _area_ids: Array<number> = [];
  @Input()
  set area_ids(area_ids) {
    this._area_ids = area_ids;
    this.fetchTillMonthChart();
  };

  /**
   * headquarter id for filter
   */
  _headquarter_ids: Array<number> = [];
  @Input()
  set headquarter_ids(headquarter_ids) {
    this._headquarter_ids = headquarter_ids;
    this.fetchTillMonthChart();
  };

  /**
   * Chart data
   */
  fetchTillMonthChart = AppConstants.debounce(function () {
    const self = this;
    self.loading = true;
      self.reportService.till_month_chart(self._region_ids, self._area_ids, self._headquarter_ids, self._month + 1, self ._year,
        self._zone_ids, self._department_id).subscribe(
        response => {
          self.prepareData(new YearTillMonth(response.year_till_month));
          self.loading = false;
        },
        err => {
          self.loading = false;
        }
      );
    }, 1000, false);

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
    this.fetchTillMonthChart();
    let current_month = moment();
    this._month = current_month.month();
    this._year = current_month.year();
    this.month_str = current_month.format('MMM');
    this.previous_month = current_month.subtract(1, 'M').format('MMM');
  }

  /**
   * draw graph
   */
  drawGraph() {

    let options = {
      chartArea: {left: 60, top: 40, bottom: 40, right: 40, width: "100%", height: "100%"},
      legend: {position: 'top', alignment: 'start'},
      title: 'Sales Performance in Lakhs',
      annotations: {
        alwaysOutside: true,
        textStyle: {
          fontSize: 10,
          color: '#000',
          auraColor: 'none'
        }
      },
      hAxis: {
        title: '',
        viewWindow: {
          min: [0, 30, 0],
          max: [17, 30, 0]
        }
      },
      vAxis: {
        title: 'Target vs Performance'
      }
    };

    this.chart = this.createColumnChart(document.getElementById('ytd_sales'));
    this.chart.draw(this.data, options);
  }

  /**
   * Chart data
   */
  fetch() {

  }

  /**
   * prepare data for graph
   */
  prepareData(year_till_month: YearTillMonth) {
    this.getGoogle().charts.setOnLoadCallback(() => {
      let google = this.getGoogle();

      let data = new google.visualization.DataTable();
      data.addColumn('string', 'YTD');
      data.addColumn('number', 'Target');
      data.addColumn({type: 'number', role: 'annotation'});
      data.addColumn('number', 'Performance');
      data.addColumn({type: 'number', role: 'annotation'});
      data.addRows([
        [this.month_str, year_till_month.month_target, year_till_month.month_target,
          year_till_month.month_sale, year_till_month.month_sale],
        ['YTD(' + this.month_str + ')', (year_till_month.till_month_target),
          (year_till_month.till_month_target),
          (year_till_month.till_month_sale),
          (year_till_month.till_month_sale)],
      ]);

      this.data = data;

      // set chart data callback
      this.drawGraph();
    });
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
    this.month_str = current_month.format('MMM');
    this.previous_month = current_month.subtract(1, 'M').format('MMM');
    this.fetchTillMonthChart();
  }
}
