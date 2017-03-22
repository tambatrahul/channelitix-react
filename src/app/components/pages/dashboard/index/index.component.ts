import {Component} from "@angular/core";
import {AttendanceService} from "../../../../services/attendance.service";
import {ReportService} from "../../../../services/report.service";
declare let jQuery: any;

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class DashBoardComponent {

    /**
     * get date range
     *
     * @returns {Array<number>}
     */
    get dates(): Array<number> {
        let dates = [];

        return dates;
    }

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

    fetchCounts() {
        this.reportService.counts()
    }
}
