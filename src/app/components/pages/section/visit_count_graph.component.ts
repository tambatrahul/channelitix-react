import {Component, Input} from "@angular/core";
declare let jQuery: any;
declare let d3: any;

@Component({
    selector: 'visit_count_graph',
    styleUrls: ['../../../templates/less/visit.component.less'],
    templateUrl: '../../../templates/pages/section/visit_count_graph.component.html',
})
export class VisitCountGraphComponent {

    /**
     * Chart options
     */
    @Input()
    public options;

    public chart_data;

    /**
     * Total customers
     */
    public total_visits: number = 0;

    /**
     * Visit Count Graph Constructor
     */
    constructor() {
    }

    /**
     * on load of component load users
     */
    ngOnInit() {
        this.options = {
            chart: {
                type: 'lineChart',
                height: 150,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value;
                },
                showValues: true,
                valueFormat: function (d) {
                    return d3.format(',.4f')(d);
                },
                duration: 500,
                xAxis: {
                    axisLabel: 'Date'
                },
                yAxis: {
                    axisLabel: 'Visit Count',
                    axisLabelDistance: -10
                }
            }
        };
    }

    /**
     * Chart data
     */
    @Input()
    set data(data) {

        // reset total
        this.total_visits = 0;

        // calculate total count
        data.map(count => this.total_visits += count.value);

        // prepare chart data
        this.chart_data = [
            {
                key: "Visits",
                values: data
            }
        ];
    }
}
