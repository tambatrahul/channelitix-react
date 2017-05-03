import {Component, Output, EventEmitter} from "@angular/core";
import * as moment from "moment";
import {AttendanceService} from "../../../../services/attendance.service";
import {ReportService} from "../../../../services/report.service";
declare let jQuery: any;

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class DashBoardComponent {

    /**
     * dates
     *
     * @type {}
     */
    dates = {
        from_date: '',
        to_date: '',
        year: ''
    };

    /**
     * total visit and total pob
     * @type {number}
     */
    public total_visits: number = 0;
    public total_pob: number = 0;
    public productive_calls: number = 0;

    /**
     * year and month for calendar
     * @type {number}
     */
    public month: number;
    public year: number;

    /**
     * Dashboard Component Constructor
     */
    constructor(private reportService: ReportService) {
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        this.month = moment().month();
        this.year = moment().year();
    }

    /**
     * On date change
     * @param dates
     */
    onDateChanged(dates) {
        this.dates = dates;
    }

    /**
     * total visit and pob values
     * @param data
     */
    totalVisitOrders(data) {
        this.total_visits = data.visits;
        this.total_pob = data.orders;
        this.productive_calls = (data.visits > 0) ? parseInt(((data.total_orders / data.visits) * 100).toFixed(2)) : 0
    }
}
