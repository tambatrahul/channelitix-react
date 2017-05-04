import {Component, Input} from "@angular/core";
import {GoogleChartComponent} from "../../../base/google_chart.component";
import {ReportService} from "../../../../services/report.service";
import {Performance} from "../../../../models/SAP/performance";
import {AppConstants} from "../../../../app.constants";
declare let jQuery: any;
declare let d3: any;

@Component({
    selector: 'monthly-primary-secondary-target',
    styleUrls: ['monthly_primary_secondary_target.component.less'],
    templateUrl: 'monthly_primary_secondary_target.component.html',
})
export class MonthlyPrimarySecondaryTargetComponent extends GoogleChartComponent {

    /**
     * data for chart
     */
    public chart_data;

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
     *
     */
    constructor(private reportService: ReportService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
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
        this.reportService.performance(2017).subscribe(
            response => {
                this.prepareData(new Performance(response.performance));
            },
            err => {

            }
        )
    }

    /**
     * prepare data for graph
     */
    prepareData(performance: Performance) {
        let google = this.getGoogle();
        let data = new google.visualization.DataTable();
        data.addColumn('string', 'Months');
        data.addColumn('number', 'Target');
        data.addColumn('number', 'Primary Sales');
        data.addColumn('number', 'Secondary Sales');
        // data.addColumn('number', 'Closing');

        let per_data = {};

        // add target to object
        performance.targets.forEach(function (target) {
            per_data[target.month-1] = {
                target: parseFloat((target.total_net_amount / 1000).toFixed(2)),
                primary: 0,
                secondary: 0
            };
        });

        // add primary sale to object
        performance.primary_sales.forEach(function (ps) {
            if (!per_data.hasOwnProperty(ps.month-1)) {
                per_data[ps.month-1] = {
                    target: 0,
                    primary: parseFloat((ps.total_net_amount / 1000).toFixed(2)),
                    secondary: 0
                };
            } else
                per_data[ps.month-1].primary = parseFloat((ps.total_net_amount / 1000).toFixed(2))
        });

        // add secondary sale to object
        performance.secondary_sales.forEach(function (ss) {
            if (!per_data.hasOwnProperty(ss.month-1)) {
                per_data[ss.month-1] = {
                    target: 0,
                    primary: 0,
                    secondary: parseFloat((ss.total_amount / 1000).toFixed(2))
                };
            } else
                per_data[ss.month].secondary = parseFloat((ss.total_amount / 1000).toFixed(2))
        });

        // prepare data
        let prepared_data = [];
        for (let key in per_data) {
            prepared_data.push([AppConstants.getMonth(key), per_data[key].target,
                per_data[key].primary, per_data[key].secondary])
        }

        // prepared data
        data.addRows(prepared_data);

        // set chart data
        this.chart_data = data;

        // set chart data callback
        this.getGoogle().charts.setOnLoadCallback(() => this.drawGraph());
    }
}