import {Component, Input} from "@angular/core";
declare let jQuery: any;
declare let d3: any;

@Component({
    selector: 'sales_trend_graph',
    templateUrl: 'sales_trend_graph.component.html',
})
export class SalesTrendComponent {

    months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    /**
     * Chart options
     */
    @Input()
    public options;

    public chart_data = [
        {
            key: "Secondary Sales",
            color: "#ff7f0e",
            values: [{"label": 1, "value": 220}, {"label": 2, "value": 230},
                {"label": 3, "value": 290}, {"label": 4, "value": 260},
                {"label": 5, "value": 240}, {"label": 6, "value": 200},
                {"label": 7, "value": 105}, {"label": 8, "value": 105},
                {"label": 9, "value": 105}, {"label": 10, "value": 11},
                {"label": 11, "value": 50}, {"label": 12, "value": 100}]
        },
        {
            key: "Targets",
            color: '#2ca02c',
            values: [{"label": 1, "value": 322}, {"label": 2, "value": 335},
                {"label": 3, "value": 395}, {"label": 4, "value": 268},
                {"label": 5, "value": 280}, {"label": 6, "value": 230},
                {"label": 7, "value": 205}, {"label": 8, "value": 205},
                {"label": 9, "value": 250}, {"label": 10, "value": 230},
                {"label": 11, "value": 100}, {"label": 12, "value": 130}]
        },
        {
            key: "Primary",
            color: '#3498db',
            values: [{"label": 1, "value": 400}, {"label": 2, "value": 450},
                {"label": 3, "value": 550}, {"label": 4, "value": 350},
                {"label": 5, "value": 300}, {"label": 6, "value": 330},
                {"label": 7, "value": 350}, {"label": 8, "value": 400},
                {"label": 9, "value": 305}, {"label": 10, "value": 311},
                {"label": 11, "value": 331}, {"label": 12, "value": 360}]
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
        let self = this;
        this.options = {
            chart: {
                type: 'lineChart',
                height: 250,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 100
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
                    tickFormat: function (d) {
                        return self.months[d - 1];
                    },
                    axisLabel: 'Month'
                },
                yAxis: {
                    axisLabel: 'Sales Trend'
                }
            }
        };
    }

    /**
     * Chart data
     */
    @Input()
    set data(data) {

    }
}
