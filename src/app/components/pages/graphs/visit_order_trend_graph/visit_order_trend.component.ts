import {Component, Input} from "@angular/core";
declare let jQuery: any;
declare let d3: any;

@Component({
    selector: 'visit_order_trend',
    templateUrl: 'visit_order_trend.component.html',
})
export class VisitOrderTrendComponent {

    /**
     * Chart options
     */
    @Input()
    public options;

    public chart_data = [
        {
            key: "Orders",
            color: "#ff7f0e",
            values: [{"label": 1, "value": 220}, {"label": 2, "value": 230}, {
                "label": 3,
                "value": 290
            }, {"label": 4, "value": 260}, {"label": 7, "value": 240}, {"label": 8, "value": 200}, {
                "label": 9,
                "value": 105
            }, {"label": 10, "value": 11}, {"label": 11, "value": 50}, {"label": 13, "value": 100}, {
                "label": 14,
                "value": 0
            }, {"label": 15, "value": 30}, {"label": 16, "value": 12}, {"label": 17, "value": 40}, {
                "label": 18,
                "value": 40
            }, {"label": 20, "value": 12}, {"label": 21, "value": 10}, {"label": 23, "value": 12}, {
                "label": 24,
                "value": 50
            }, {"label": 25, "value": 30}, {"label": 27, "value": 15}, {"label": 28, "value": 200}]
        },
        {
            key: "Visits",
            color: '#2ca02c',
            values: [{"label": 1, "value": 322}, {"label": 2, "value": 335}, {
                "label": 3,
                "value": 395
            }, {"label": 4, "value": 268}, {"label": 7, "value": 280}, {"label": 8, "value": 230}, {
                "label": 9,
                "value": 155
            }, {"label": 10, "value": 111}, {"label": 11, "value": 100}, {"label": 13, "value": 130}, {
                "label": 14,
                "value": 40
            }, {"label": 15, "value": 100}, {"label": 16, "value": 200}, {"label": 17, "value": 240}, {
                "label": 18,
                "value": 160
            }, {"label": 20, "value": 170}, {"label": 21, "value": 100}, {"label": 23, "value": 40}, {
                "label": 24,
                "value": 60
            }, {"label": 25, "value": 220}, {"label": 27, "value": 500}, {"label": 28, "value": 300}]
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
                type: 'lineChart',
                height: 170,
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
                    axisLabel: 'Visit Order Trend',
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
        this.chart_data = [
            {
                key: "Visits",
                color: '#2ca02c',
                values: [{"label": 1, "value": 322}, {"label": 2, "value": 335}, {
                    "label": 3,
                    "value": 395
                }, {"label": 4, "value": 268}, {"label": 7, "value": 280}, {"label": 8, "value": 230}, {
                    "label": 9,
                    "value": 155
                }, {"label": 10, "value": 111}, {"label": 11, "value": 0}, {"label": 13, "value": 1}, {
                    "label": 14,
                    "value": 0
                }, {"label": 15, "value": 0}, {"label": 16, "value": 0}, {"label": 17, "value": 0}, {
                    "label": 18,
                    "value": 0
                }, {"label": 20, "value": 0}, {"label": 21, "value": 0}, {"label": 23, "value": 0}, {
                    "label": 24,
                    "value": 0
                }, {"label": 25, "value": 0}, {"label": 27, "value": 0}, {"label": 28, "value": 0}]
            }
        ];
    }
}
