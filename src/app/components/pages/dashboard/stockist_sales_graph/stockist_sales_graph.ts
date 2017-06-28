import {Component, Input} from "@angular/core";
import {GoogleChartComponent} from "../../../base/google_chart.component";
import {ReportService} from "../../../../services/report.service";
import * as moment from "moment";
import {AuthService} from "../../../../services/AuthService";
import {Observable} from "rxjs";
import {MonthStockistSale} from "../../../../models/SAP/month_stockist_sale";
import {YearStockistSale} from "../../../../models/SAP/year_stockist_sale";

declare let jQuery: any;
declare let d3: any;


@Component({
    selector: 'stockist_sales_graph',
    styleUrls: ['stockist_sales_graph.less'],
    templateUrl: 'stockist_sales_graph.html',
    inputs: ['refresh']
})
export class StockistSalesGraphComponent extends GoogleChartComponent {

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
    month: number;
    year: number;

    /**
     * customer Id
     */
    public customer_id: number = 0;

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
        this.fetch();
        let current_month = moment();
        this.month = current_month.month();
        this.year = current_month.year();
        this.month_str = current_month.format('MMM');
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
                title: 'Stockist vs Sales'
            }
        };

        this.chart = this.createColumnChart(document.getElementById('stockist_sales'));
        this.chart.draw(this.data, options);
    }

    /**
     * Chart data
     */
    fetch() {
        if (this.month && this.year) {
            this.loading = true;
            Observable.forkJoin(
                this.reportService.stockist_sales_monthly(this._region_ids, this._area_ids, this._headquarter_ids, this.month + 1, this.year, this.customer_id),
                this.reportService.stockist_sales_yearly(this._region_ids, this._area_ids, this._headquarter_ids, this.month + 1, this.year - 1, this.customer_id)
            ).subscribe(data => {
                    this.prepareData(new MonthStockistSale(data[0].monthly_sale), new YearStockistSale(data[1].yearly_sale));
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
    prepareData(monthly_sale: MonthStockistSale, yearly_sale: YearStockistSale) {
        this.getGoogle().charts.setOnLoadCallback(() => {
            let google = this.getGoogle();

            if (yearly_sale.yearly_stockist_sale > 0)
                yearly_sale.yearly_stockist_sale = yearly_sale.yearly_stockist_sale / 12;

            if (yearly_sale.yearly_stockist_sale_ab > 0)
                yearly_sale.yearly_stockist_sale_ab = yearly_sale.yearly_stockist_sale_ab / 12;

            let data = new google.visualization.DataTable();
            data.addColumn('string', 'YTD');
            data.addColumn('number', 'Stockist');
            data.addColumn({type: 'number', role: 'annotation'});
            data.addColumn('number', 'Stockist A/B');
            data.addColumn({type: 'number', role: 'annotation'});
            data.addRows([
                [(this.year - 1) + "", yearly_sale.yearly_stockist_sale_ab, yearly_sale.yearly_stockist_ab_count,
                    yearly_sale.yearly_stockist_sale, yearly_sale.yearly_stockist_count],
                [this.month_str, monthly_sale.monthly_stockist_sale_ab, monthly_sale.monthly_stockist_ab_count,
                    monthly_sale.monthly_stockist_sale, monthly_sale.monthly_stockist_count],
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
        this.fetch();
    }

    /**
     * customer Filter
     *
     * @param customer_id
     */
    customerChanged(customer_id) {
        this.customer_id = customer_id;
        this.fetch();
    }
}
