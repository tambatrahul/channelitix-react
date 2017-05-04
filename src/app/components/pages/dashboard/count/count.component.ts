import {Component, Input} from "@angular/core";
import {ReportService} from "../../../../services/report.service";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {AuthService} from "../../../../services/AuthService";
declare let jQuery: any;

@Component({
    selector: 'dashboard-count',
    templateUrl: 'count.component.html',
    styleUrls: ['count.component.less']
})
export class DashBoardCountComponent extends BaseAuthComponent {

    /**
     * get all count
     *
     * @type {}
     */
    counts = {
        total_users: 0,
        total_active_users: 0,
        total_customers: 0,
        total_visits: 0,
        call_average: 0,
        productive_calls: 0,
        total_bricks: 0
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
    constructor(private reportService: ReportService, protected _authService: AuthService) {
        super(_authService);
    }

    /**
     * fetch counts from server
     */
    fetchCounts() {
        this.loading = true;
        this.reportService.counts(this._dates.from_date, this._dates.to_date, this._dates.year).subscribe(
            response => {
                this.counts = response;
                this.loading = false;
            }, err => {
                this.loading = false;
            }
        );
    }
}
