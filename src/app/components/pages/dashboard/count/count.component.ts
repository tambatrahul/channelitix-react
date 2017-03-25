import {Component, Input} from "@angular/core";
import {AttendanceService} from "../../../../services/attendance.service";
import {ReportService} from "../../../../services/report.service";
declare let jQuery: any;

@Component({
    selector: 'dashboard-count',
    templateUrl: 'count.component.html',
    styleUrls: ['count.component.less']
})
export class DashBoardCountComponent {

    /**
     * get all count
     *
     * @type {}
     */
    counts = {
        total_users: 0,
        total_active_users: 0,
        total_customers: 0,
        total_working_days: 0
    };

    /**
     * dates
     *
     * @type {}
     */
    _dates = {from_date: '', to_date: '', year: ''};
    @Input()
    set dates(dates) {
        this._dates = dates;
        this.fetchCounts();
    }


    /**
     * Dashboard Component Constructor
     */
    constructor(private reportService: ReportService) {
    }

    /**
     * fetch counts from server
     */
    fetchCounts() {
        this.reportService.counts(this._dates.from_date, this._dates.to_date, this._dates.year).subscribe(
            response => {
                this.counts = response;
            }, err => {
            }
        );
    }
}
