import {Component} from "@angular/core";
import {AttendanceService} from "../../../../services/attendance.service";
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
     * Attendance Component Constructor
     *
     */
    constructor(private attendanceService: AttendanceService) {
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {

    }
}
