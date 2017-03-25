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
}
