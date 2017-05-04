import {Component, Input} from "@angular/core";
import {Attendance} from "../../../../../models/attendance/attendance";
import {AppConstants} from "../../../../../app.constants";
import {GoogleChartComponent} from "../../../../base/google_chart.component";
declare let jQuery: any;
declare let d3: any;
declare let nv;

@Component({
    selector: 'summary-visit-order-graph',
    templateUrl: 'summary_visit_order_graph.component.html'
})
export class SummaryVisitOrderGraphComponent extends GoogleChartComponent {

    /**
     * call average and pob amount
     */
    call_average: number = 0;
    pob_amount: number = 0;

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

    /**
     * draw graph
     */
    drawGraph() {
        this.data = this.createDataTable(this.chart_data);

        this.options = {
            title: '',
            chartArea: {width: '70%'},
            hAxis: {
                title: 'Date',
                minValue: 1
            },
            seriesType: 'bars',
            vAxes: [
                {title: 'Visit', minValue: 0, viewWindow: {min: 0}},
                {title: 'POB in (₹)', viewWindow: {min: 0}}
            ],
            bar: {
                groupWidth: '80%'
            },
            series: [
                {axis: 0, type: 'bar', targetAxisIndex: 0},
                {axis: 1, type: 'line', targetAxisIndex: 1},
                {axis: 2, type: 'line', targetAxisIndex: 0, lineWidth: 0.9, lineDashStyle: [4, 1]}
            ]
        };

        this.chart = this.createComboChar(document.getElementById('chart_divEvolution'));
        this.chart.draw(this.data, this.options);
    }

    /**
     * Chart data
     */
    @Input()
    set attendances(attendances: Attendance[]) {
        let self = this;
        this.call_average = 0;
        this.pob_amount = 0;
        if (attendances.length > 0) {
            let data = [];
            data.push(['Date', 'Visits', 'POB in (₹)', 'Average']);

            let total = 0;
            attendances.map(function (attendance) {
                if (!attendance.isSunday && !attendance.isHoliday && !attendance.isDisabled
                    && (attendance.status == null || attendance.status == AppConstants.WORKING)) {
                    data.push([
                        attendance.day,
                        attendance.no_of_calls ? attendance.no_of_calls : 0,
                        attendance.pob_amount ? attendance.pob_amount : 0,
                        25
                    ]);
                    if (attendance.work_type && attendance.work_type.name == AppConstants.FIELD_WORK) {
                        total += 1;
                        self.call_average += attendance.no_of_calls;
                        self.pob_amount += attendance.pob_amount;
                    }
                }
            });

            this.call_average = parseInt((this.call_average/(total > 0 ? total: 1)).toFixed(1));

            // prepare chart data
            this.chart_data = data;

            // set chart data callback
            this.getGoogle().charts.setOnLoadCallback(() => this.drawGraph());
        }
    }

    fetch() {

    }
}