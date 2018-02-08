import {Component, Input} from "@angular/core";
import {GoogleChartComponent} from "../../../base/google_chart.component";
import {ReportService} from "../../../../services/report.service";
import {AuthService} from "../../../../services/AuthService";
import * as moment from "moment";
import {PrimarySale} from "../../../../models/sale/primary_sale";
import {Observable} from "rxjs/Observable";

declare let jQuery: any;
declare let d3: any;

@Component({
  selector: 'skinlite-sales-analysis-graph',
  styleUrls: ['skinlite_sales_analysis_graph.component.less'],
  templateUrl: 'skinlite_sales_analysis_graph.component.html',
  inputs: ['refresh']
})
export class SkinliteSaleAnalysisGraphComponent extends GoogleChartComponent {

  month: number;
  year: number;
  geo_stockist_count: number = 0;
  liva_stockist_count: number = 0;
  common_stockist_count: number = 0;

  geo_avg_sale: number = 0;
  liva_avg_sale: number = 0;
  common_avg_sale: number = 0;

  // set month array
  public months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

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
  public options = {
    legend: {position: 'top', alignment: 'start'},
    title: 'Sales',
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
    backgroundColor: "transparent",
    shadow: false,
    tooltip: {
      isHtml: true, ignoreBounds: true,
      textStyle: {fontSize: 12}
    },
    bar: {groupWidth: '75%'},
    isStacked: true
  };

  /**
   * chart and data
   */
  private data;
  private chart;

  /**
   * data for chart
   */
  public chart_data = [];

  public btn_loading: boolean = false;

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

    this.chart = this.createComboChar(document.getElementById('skinliteSaleAnalysis'));
    this.chart.draw(this.data, this.options);
  }

  /**
   * Chart data
   */
  fetch() {
    if ((this.month || this.month == 0) && this.year) {
      this.loading = true;
      Observable.forkJoin(
        this.reportService.skinlite_sales_analysis_graph(this._region_ids, this._area_ids, this._headquarter_ids,
          this.year),
        this.reportService.skinlite_avg_sales_analysis_graph(this._region_ids, this._area_ids, this._headquarter_ids,
          this.year)
      ).subscribe(
        data => {
          let geo_primary_sales = data[0].geo_stockist_primary_sales.map(pr => new PrimarySale(pr));
          let liva_primary_sales = data[0].liva_stockist_primary_sales.map(pr => new PrimarySale(pr));
          let common_primary_sales = data[0].common_stockist_primary_sales.map(pr => new PrimarySale(pr));

          let last_year_geo_primary_sales = data[1].last_year_geo_stockist_primary_sales.map(pr => new PrimarySale(pr));
          let last_year_liva_primary_sales = data[1].last_year_liva_stockist_primary_sales.map(pr => new PrimarySale(pr));
          let last_year_common_primary_sales = data[1].last_year_common_stockist_primary_sales.map(pr => new PrimarySale(pr));

          this.prepareDataForAvgYear(last_year_geo_primary_sales, last_year_liva_primary_sales, last_year_common_primary_sales);

          this.getGoogle().charts.setOnLoadCallback(() => {
            this.getData(geo_primary_sales, liva_primary_sales, common_primary_sales);
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
  getData(geo_primary_sales: PrimarySale[], liva_primary_sales: PrimarySale[],
          common_primary_sales: PrimarySale[]) {
    let sales = {};

    for (let mon in this.months) {
      sales[mon] = {
        'geo_customer_count': 0,
        'geo_primary_sale': 0,
        'common_customer_count': 0,
        'common_primary_sale': 0,
        'liva_customer_count': 0,
        'liva_primary_sale': 0
      };
    }

    geo_primary_sales.map(function (geo_primary_sale) {
      sales[geo_primary_sale.month - 1].geo_primary_sale = geo_primary_sale.total_net_amount;
      sales[geo_primary_sale.month - 1].geo_customer_count = geo_primary_sale.customer_count;
    });

    liva_primary_sales.map(function (liva_primary_sale) {
      sales[liva_primary_sale.month - 1].liva_primary_sale = liva_primary_sale.total_net_amount;
      sales[liva_primary_sale.month - 1].liva_customer_count = liva_primary_sale.customer_count;
    });

    common_primary_sales.map(function (common_primary_sale) {
      sales[common_primary_sale.month - 1].common_primary_sale = common_primary_sale.total_net_amount;
      sales[common_primary_sale.month - 1].common_customer_count = common_primary_sale.customer_count;
    });

    // initialize graph data
    let data = this.getDataTable();

    // set graph column
    data.addColumn('string', 'Months');
    data.addColumn('number', 'Geo Stockist');
    data.addColumn({type: 'string', role: 'tooltip', 'p': {'html': true}});
    data.addColumn('number', 'Common Stockist');
    data.addColumn({type: 'string', role: 'tooltip', 'p': {'html': true}});
    data.addColumn('number', 'Liva Stockist');
    data.addColumn({type: 'string', role: 'tooltip', 'p': {'html': true}});

    data.addRow(['Avg' + (this.year - 1),
      this.geo_stockist_count,
      this.avgToolTip('Geo', 'AVG', this.geo_stockist_count, this.geo_avg_sale),
      this.common_stockist_count,
      this.avgToolTip('Common', 'AVG', this.common_stockist_count, this.common_avg_sale),
      this.liva_stockist_count,
      this.avgToolTip('Liva', 'AVG', this.liva_stockist_count, this.liva_avg_sale),
    ]);

    for (let mon in this.months) {
      if (parseInt(mon) <= this.month) {
        data.addRow([this.months[mon],
          sales[mon].geo_customer_count,
          this.toolTip('Geo', this.months[mon], sales[mon].geo_customer_count, sales[mon].geo_primary_sale),
          sales[mon].common_customer_count,
          this.toolTip('Common', this.months[mon], sales[mon].common_customer_count, sales[mon].common_primary_sale),
          sales[mon].liva_customer_count,
          this.toolTip('Liva', this.months[mon], sales[mon].liva_customer_count, sales[mon].liva_primary_sale),
        ]);
      }
    }

    // set graph rows
    this.data = data;

    // crete chart
    this.chart = this.createColumnChart(document.getElementById('skinliteSaleAnalysis'));
    this.chart.draw(this.data, this.options);

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

  /**
   * Set Tooltip
   *
   * @param brand_category
   * @param month
   * @param stockist_count
   * @param sale
   * @returns {string}
   */
  toolTip(brand_category, month, stockist_count, sale) {
    return '<div style="white-space: nowrap; padding:5px;"><b>' + month + '</b>' +
      '<br><b>' + brand_category + ' Customer :' + stockist_count + '</b>' +
      '<br><b>' + brand_category + ' Customer Sale in (000) :' + (sale / 1000).toFixed(0) + '</b>' +
      '</div>';
  }

  /**
   *
   * @param brand_category
   * @param month
   * @param stockist_count
   * @param sale
   * @returns {string}
   */
  avgToolTip(brand_category, month, stockist_count, sale) {
    return '<div style="white-space: nowrap; padding:5px;"><b>' + month + '</b>' +
      '<br><b>' + brand_category + ' Customer :' + stockist_count + '</b>' +
      '<br><b>' + brand_category + ' Customer Avg Sale in (000) :' + (sale / 1000).toFixed(0) + '</b>' +
      '</div>';
  }

  /**
   * Prepare Data for Last Year
   *
   * @param {PrimarySale[]} last_year_geo_sales
   * @param {PrimarySale[]} last_year_liva_sales
   * @param {PrimarySale[]} last_year_common_sales
   */
  prepareDataForAvgYear(last_year_geo_sales: PrimarySale[], last_year_liva_sales: PrimarySale[], last_year_common_sales: PrimarySale[]) {
    let geo_total_month = last_year_geo_sales[0].old_date_value ? this.getTotalMonthCount(last_year_geo_sales[0].old_date_value) : 0;

    this.geo_stockist_count = last_year_geo_sales[0].customer_count;
    this.geo_avg_sale = last_year_geo_sales[0].total_net_amount / geo_total_month;
    this.liva_avg_sale = 22099538;
    this.liva_stockist_count = 173;
    this.common_avg_sale = 21053908;
    this.common_stockist_count = 165;
  }

  // get total month count
  getTotalMonthCount(old_date) {
    // set current And ol date
    let current_month = moment().month() + 1;
    let current_year = moment().year();
    let old_month = moment(old_date).month() + 1;
    let old_year = moment(old_date).year();

    // get count
    let count = 0;
    // check for old year is less than current year
    if (old_year < current_year) {
      for (let i = old_month; i <= 12; i++) {
        count += 1;
      }
    }
    return count;
  }
}
