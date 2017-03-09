import {Component, Input} from "@angular/core";
declare let jQuery: any;
declare let d3: any;

@Component({
    selector: 'highest_order_graph',
    templateUrl: '../../../templates/pages/graphs/highest_order_graph.component.html',
})
export class HighestOrderComponent {

    /**
     * Chart options
     */
    @Input()
    public options;

    public chart_data = [
        {
            key: "Highest Orders",
            values: [
                {
                    "label" : "Ashok" ,
                    "value" : 5000
                } ,
                {
                    "label" : "Rakesh" ,
                    "value" : 3000.50
                } ,
                {
                    "label" : "Chirag" ,
                    "value" : 2500.00
                } ,
                {
                    "label" : "Abhishek" ,
                    "value" : 1555.55
                } ,
                {
                    "label" : "Karan" ,
                    "value" : 1000.30
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
                    d = d/1000;
                    return d3.format(',.2f')(d);
                },
                color:function(){
                    return '#e74c3c';
                },
                duration: 500,
                xAxis: {
                    axisLabel: 'User',
                    axisLabelDistance: 20
                },
                rotateLabels: 45,
                yAxis: {
                    axisLabel: 'Amount',
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
