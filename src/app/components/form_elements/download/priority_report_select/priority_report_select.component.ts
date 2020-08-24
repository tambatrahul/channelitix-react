import {Component, Input, Output} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {DownloadService} from "../../../../services/download.service";
import {PriorityReport} from "../../../../models/download/priority_report";

@Component({
    selector: 'priority-report-select',
    templateUrl: 'priority_report_select.component.html',
    inputs: ['refresh']
})
export class PriorityReportSelectComponent extends BaseSelectComponent {

    /**
     * Title of input select field
     */
    @Input()
    title: string = "Select Dr. Detailing Report";

    /**
     * First value of options
     */
    @Input()
    first_value: string = "Select Dr. Detailing Report";

    /**
     * Priority report list
     *
     * @type {Array}
     */
    priority_reports: PriorityReport[];

    constructor(private downloadService: DownloadService) {
        super();
    }

    /**
     * view
     *
     * @type {number}
     * @private
     */
    _refresh: boolean;
    set refresh(refresh) {
        this._refresh = refresh;
        this.fetch();
    }

    /**
     * fetch input from constants
     */
    fetch() {
        this.loading = true;
        this.downloadService.priorityReportLists()
            .subscribe(
                response => {
                    this.loading = false;
                    this.models = response.priority_reports;
                },
                err => {
                    this.loading = false;
                }
            );
    }
}
