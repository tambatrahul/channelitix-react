import {Component, Input} from "@angular/core";
import {GoogleChartComponent} from "../../../base/google_chart.component";
import {ReportService} from "../../../../services/report.service";
import {YearTillMonth} from "../../../../models/SAP/year_till_month";
import * as moment from "moment";
import {AuthService} from "../../../../services/AuthService";
import {AppConstants} from '../../../../app.constants';
import {Performance} from '../../../../models/SAP/performance';
import { V2ReportService } from "app/services/v2/report.service";

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
  public month_name: string;


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
    this.month_name = moment.months(this._month);
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
    if ((self._month || self._month == 0) && self._year) {
      self.loading = true;
      self.reportService.till_month_chart(self._region_ids, self._area_ids, self._headquarter_ids, self._month + 1, self._year,
        self._zone_ids, self._department_id).subscribe(
        response => {
          self.prepareData(new YearTillMonth(response.ytd_summary));
          self.loading = false;
        },
        err => {
          self.loading = false;
        }
      );
    }
    }, 1000, false);

  /**
   * TillMonthChartComponent constructor
   */
  constructor(private reportService: V2ReportService, public _service: AuthService) {
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
        title: 'Target vs Performance',
      },
      isStacked: true,
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
  prepareData(ytd_summary: YearTillMonth) {
    this.getGoogle().charts.setOnLoadCallback(() => {
      const google = this.getGoogle();
      const data = new google.visualization.DataTable();
      data.addColumn('string', 'YTD');
      for ( let i = 0; i < ytd_summary.portfolio_names.length; i++) {
        data.addColumn('number', ytd_summary.portfolio_names[i]['sub_name']);
      }
      data.addColumn({type: 'number', role: 'annotation'});

      let rows = [['Target(' + this.month_name + ')',0],['Performance(' + this.month_name + ')',0],
          ['YTD Target(' + this.month_name + ')',0],['YTD Performance(' + this.month_name + ')',0]]

      /* rows.fill(0, 0, year_till_month.sub_name.length-1); */
      for (let i=0; i < rows.length; i++) {
        for (let j=0;j < ytd_summary.portfolio_names.length - 1; j++) {
          rows[i].push(0);
        }
      }

      for (let i = 0; i < rows.length; i++) {
        for(let j = 1;j <= ytd_summary.portfolio_names.length; j++) {
          for(let k = 0; k <= ytd_summary.portfolio_names.length - 1; k++) {
            if (k == j - 1) {
              if ( i==0 )
                rows[i][j] = ytd_summary.primary_sales_and_target[k]['total_target'];
              if ( i==1 )
                rows[i][j] = ytd_summary.primary_sales_and_target[k]['total_net_amt'];
              if ( i==2 )
                rows[i][j] = ytd_summary.primary_sales_and_target[k]['YTD_target'];
              if ( i==3 )
                rows[i][j] = ytd_summary.primary_sales_and_target[k]['YTD_sale'];
            }
            else {
              continue;
            }
          }
        }
      }

      let total_target = 0 , total_sale = 0, ytd_target = 0, ytd_sale = 0;

      for (let l = 0; l <= ytd_summary.portfolio_names.length - 1; l++) {
        total_target += ytd_summary.primary_sales_and_target[l]['total_target'];
        total_sale += ytd_summary.primary_sales_and_target[l]['total_net_amt'];
        ytd_target += ytd_summary.primary_sales_and_target[l]['YTD_target'];
        ytd_sale += ytd_summary.primary_sales_and_target[l]['YTD_sale'];
      }
      rows[0].push(total_target);
      rows[1].push(total_sale);
      rows[2].push(ytd_target);
      rows[3].push(ytd_sale);

      /* for (let a=0; a<rows.length; a++){
        data.addRows([rows[a]]);
      } */
      data.addRows(rows);
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
