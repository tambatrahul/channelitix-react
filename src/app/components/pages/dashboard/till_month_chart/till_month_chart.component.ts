import {Component, Input} from "@angular/core";
import {GoogleChartComponent} from "../../../base/google_chart.component";
import {ReportService} from "../../../../services/report.service";
import {YearTillMonth} from "../../../../models/SAP/year_till_month";
import * as moment from "moment";

declare let jQuery: any;
declare let d3: any;


@Component({
    selector: 'till-month-chart',
    styleUrls: ['till_month_chart.component.less'],
    templateUrl: 'till_month_chart.component.html',
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

    month: string;
    previous_month: string;

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
     * country id for filter
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
    constructor(private reportService: ReportService) {
        super();
    }

    /**
     * initialize data
     */
    ngOnInit() {
        super.ngOnInit();
        this.fetch();
        this.month = moment().format('MMM');
        this.previous_month = moment().subtract(1, 'M').format('MMM');
    }

    /**
     * draw graph
     */
    drawGraph() {

        let options = {
            chartArea: {left: 60, top: 40, bottom: 40, right: 40, width: "100%", height: "100%"},
            legend: {position: 'top', alignment: 'start'},
            title: 'Sales Performance in Thousands',
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
        this.reportService.till_month_chart().subscribe(
            response => {
                this.prepareData(new YearTillMonth(response.year_till_month));
            },
            err => {

            }
        )
    }

    /**
     * prepare data for graph
     */
    prepareData(year_till_month: YearTillMonth) {
        let google = this.getGoogle();

        let data = new google.visualization.DataTable();
        data.addColumn('string', 'YTD');
        data.addColumn('number', 'Target');
        data.addColumn({type: 'number', role: 'annotation'});
        data.addColumn('number', 'Performance');
        data.addColumn({type: 'number', role: 'annotation'});
        data.addRows([
            ['YTD(' + this.previous_month + ')', year_till_month.till_month_target, year_till_month.till_month_target,
                year_till_month.till_month_sale, year_till_month.till_month_sale],
            [this.month, year_till_month.month_target, year_till_month.month_target,
                year_till_month.month_sale, year_till_month.month_sale],
            ['YTD(' + this.month + ')', (year_till_month.till_month_target + year_till_month.month_target),
                (year_till_month.till_month_target + year_till_month.month_target),
                (year_till_month.till_month_sale + year_till_month.month_sale),
                (year_till_month.till_month_sale + year_till_month.month_sale)],
        ]);

        this.data = data;

        // set chart data callback
        this.getGoogle().charts.setOnLoadCallback(() => this.drawGraph());
    }
}
