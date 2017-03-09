import {Component, Input} from "@angular/core";
declare let jQuery: any;
declare let d3: any;

@Component({
    selector: 'highest_call_graph',
    templateUrl: '../../../templates/pages/graphs/highest_call_graph.component.html',
})
export class HighestCallComponent {

    /**
     * Chart options
     */
    @Input()
    public options;

    public chart_data = [
        {
            key: "Highest Calls",
            values: [
                {
                    "label" : "Ashok" ,
                    "value" : 50
                } ,
                {
                    "label" : "Rakesh" ,
                    "value" : 40
                } ,
                {
                    "label" : "Chirag" ,
                    "value" : 35
                } ,
                {
                    "label" : "Abhishek" ,
                    "value" : 33
                } ,
                {
                    "label" : "Karan" ,
                    "value" : 20
                }
            ]
        }
    ];

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
                type: 'discreteBarChart',
                height: 200,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 70,
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
                    return d3.format(',.0f')(d);
                },
                color:function(){
                    return '#3498db';
                },
                duration: 500,
                xAxis: {
                    axisLabel: 'User',
                    axisLabelDistance: 20
                },
                rotateLabels: 45,
                yAxis: {
                    axisLabel: 'Calls',
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

        // prepare chart data
        this.chart_data = [];
    }
}
