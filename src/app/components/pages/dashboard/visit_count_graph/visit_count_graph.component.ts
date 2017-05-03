import {Component, Input, Output, EventEmitter} from "@angular/core";
import {GoogleChartComponent} from "../../../base/google_chart.component";
import {ReportService} from "../../../../services/report.service";
import {Order} from "../../../../models/order/order";
import {Visit} from "../../../../models/visit/visit";
import {Attendance} from "../../../../models/attendance/attendance";
declare let jQuery: any;
declare let d3: any;

@Component({
    selector: 'visit-count-graph',
    styleUrls: ['../../visit/index/index.component.less'],
    templateUrl: 'visit_count_graph.component.html',
})
export class VisitCountGraphComponent extends GoogleChartComponent {

    /**
     * total visit and total pob
     * @type {number}
     */
    public total_visits: number = 0;
    public total_pob: number = 0;
    public total_orders: number = 0;

    /**
     * return total visit and orders
     * @type {EventEmitter}
     */
    @Output()
    totalVisitOrders = new EventEmitter();

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
     * visit and order arrays
     *
     * @type {Array}
     */
    visits: Visit[] = [];
    orders: Order[] = [];
    attendances: Attendance[] = [];

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
        this.data = this.createDataTable(this.chart_data);

        this.options = {
            chartArea: {left: 60, top: 40, bottom: 40, right: 20, width: "100%", height: "100%"},
            title: '',
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
                {axis: 1, type: 'line', targetAxisIndex: 1}
            ]
        };

        this.chart = this.createComboChar(document.getElementById('chart_divEvolution'));
        this.chart.draw(this.data, this.options);
    }

    /**
     * Chart data
     */
    fetch() {
        this.reportService.visit_order_trend(this._dates.from_date, this._dates.to_date, this._dates.year).subscribe(
            response => {
                this.visits = response.visits.map(function (visit) {
                    return new Visit(visit);
                });
                this.orders = response.orders.map(function (order) {
                    return new Order(order);
                });
                this.attendances = response.attendances.map(function (att) {
                    return new Attendance(att);
                });

                this.total_orders = response.total_orders;

                this.prepareData();
            },
            err => {

            }
        )
    }

    /**
     * prepare data for graph
     */
    prepareData() {
        let data = [];
        data.push(['Date', 'Visit', 'POB in (₹)']);

        let data_object = {};
        this.attendances.forEach(function (att) {
            data_object[att.att_day] = {
                visit_count: 0,
                order_count: 0,
                att_count: att.att_count
            };
        });

        // add visit to data
        this.visits.forEach(function (visit) {
            if (data_object.hasOwnProperty(visit.visit_day))
                data_object[visit.visit_day].visit_count = visit.visit_count;
        });

        // add order to data
        this.orders.forEach(function (order) {
            if (data_object.hasOwnProperty(order.order_day))
                data_object[order.order_day].order_count = order.order_day_total_count;
        });

        this.chart_data = [];
        this.total_visits = 0;
        this.total_pob = 0;
        for (let key in data_object) {
            data.push([
                key,
                data_object[key].visit_count,
                data_object[key].order_count
            ]);
            this.total_visits += data_object[key].visit_count;
            this.total_pob += data_object[key].order_count;
        }

        // set chart data
        this.chart_data = data;

        // set total visit and order
        this.totalVisitOrders.emit({
            'visits': this.total_visits,
            'orders': this.total_pob,
            'total_orders': this.total_orders
        });

        // set chart data callback
        this.getGoogle().charts.setOnLoadCallback(() => this.drawGraph());
    }
}
