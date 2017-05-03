import {Component} from "@angular/core";
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
     * Dashboard Component Constructor
     */
    constructor(private reportService: ReportService) {
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {

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
