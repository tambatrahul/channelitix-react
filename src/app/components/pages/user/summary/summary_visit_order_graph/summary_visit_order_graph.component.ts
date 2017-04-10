import {Component, Input} from "@angular/core";
import {Attendance} from "../../../../../models/attendance/attendance";
import {AppConstants} from "../../../../../app.constants";
declare let jQuery: any;
declare let d3: any;
declare let nv;

@Component({
    selector: 'summary-visit-order-graph',
    templateUrl: 'summary_visit_order_graph.component.html'
})
export class SummaryVisitOrderGraphComponent {

    /**
     * Chart options
     */
    @Input()
    public options;

    /**
     * data for chart
     */
    public chart_data;
    public _data;

    /**
     * Visit Count Graph Constructor
     */
    constructor() {
    }

    /**
     * on load of component load users
     */
    ngOnInit() {
    }

    prepareOptions() {
        let self = this;
        nv.addGraph(function () {
            let chart = nv.models.linePlusBarChart()
                .margin({top: 30, right: 60, bottom: 50, left: 70})
                .x(function (d, i) {
                    return d.x
                })
                .y(function (d) {
                    return d.y
                })
                .options({focusEnable: false})
                .color(d3.scale.category10().range());

            chart.xAxis
                .showMaxMin(false)
                .tickFormat(function (d) {
                    return d;
                });

            chart.y2Axis
                .tickFormat(d3.format(',f'));

            chart.y1Axis
                .tickFormat(function (d) {
                    return '₹' + d3.format(',f')(d)
                });

            chart.bars.forceY([0]);

            d3.select('#chart svg')
                .datum(self._data)
                .transition().duration(500)
                .call(chart);

            nv.utils.windowResize(chart.update);

            chart.tooltip.contentGenerator(function (data) {
                return '<p>' + data.point.x + '</p>'
                    + '<p> Visits: ' + self._data[0].values[data.pointIndex].y + '</p>'
                    + '<p> POB: ' + self._data[1].values[data.pointIndex].y + '</p>';
            });
            return chart;
        });
    }

    /**
     * Chart data
     */
    @Input()
    set attendances(attendances: Attendance[]) {

        let visit_values = [];
        let pob_values = [];


        attendances.map(function (attendance) {
            if (!attendance.isSunday && !attendance.isHoliday && !attendance.isDisabled
                && (attendance.status == null || attendance.status == AppConstants.WORKING)) {
                visit_values.push({
                    x: attendance.day,
                    y: attendance.no_of_calls ? attendance.no_of_calls : 0
                });
                pob_values.push({
                    x: attendance.day,
                    y: attendance.pob_amount ? attendance.pob_amount : 0
                });
            }
        });

        // prepare chart data
        this.chart_data = [
            {
                "color": "#333",
                "key": "Visits",
                "values": visit_values
            },
            {
                "color": "#ccf",
                "key": "POB",
                "values": pob_values
            }
        ];

        this._data = [
            {
                "color": "#333",
                "key": "Visits",
                "values": visit_values.map(value => Object.assign({}, value))
            },
            {
                "color": "#ccf",
                "bar": true,
                "key": "POB",
                "values": pob_values.map(value => Object.assign({}, value))
            }
        ];

        this.prepareOptions();
    }
}