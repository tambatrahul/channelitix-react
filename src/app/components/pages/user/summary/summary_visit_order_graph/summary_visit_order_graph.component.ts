import {Component, Input} from "@angular/core";
import {Attendance} from "../../../../../models/attendance/attendance";
import {AppConstants} from "../../../../../app.constants";
declare let jQuery: any;
declare let d3: any;

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
        this.options = {
            chart: {
                type: 'linePlusBarChart',
                height: 200,
                margin: {
                    top: 30,
                    right: 90,
                    bottom: 50,
                    left: 80
                },
                focusEnable: false,
                x: function (d, i) {
                    return i;
                },
                y: function (d, i) {
                    return d.y;
                },
                tooltip: false,
                showValues: true,
                duration: 500,
                xAxis: {
                    axisLabel: 'Date',
                    tickFormat: function (d) {
                        return d;
                    }
                },
                y2Axis: {
                    axisLabel: 'Visit Count',
                    tickFormat: function (d) {
                        return d;
                    }
                },
                y1Axis: {
                    axisLabel: 'POB Amount',
                    tickFormat: function (d) {
                        return '₹' + d3.format(',0.1f')(d)
                    },
                    showMaxMin: true
                },
                forceY: [0]
            }
        };
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
                "bar": true,
                "key": "POB",
                "values": pob_values
            }
        ];

        this._data = [
            {
                "color": "#333",
                "key": "Visits",
                "values": visit_values
            },
            {
                "color": "#ccf",
                "bar": true,
                "key": "POB",
                "values": pob_values
            }
        ];

        this.prepareOptions();
    }
}