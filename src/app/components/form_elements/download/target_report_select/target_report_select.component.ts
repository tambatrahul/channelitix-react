import {Component, Input, Output} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {DownloadService} from "../../../../services/download.service";
import {TargetReport} from "../../../../models/download/target_report";

@Component({
    selector: 'target-report-select',
    templateUrl: 'target_report_select.component.html',
    inputs: ['refresh']
})
export class TargetReportSelectComponent extends BaseSelectComponent {

    /**
     * Title of input select field
     */
    @Input()
    title: string = "Target Detailed Report";

    /**
     * First value of options
     */
    @Input()
    first_value: string = "Select Target Detailed Report";

    /**
     * Target report list
     *
     * @type {Array}
     */
    target_reports: TargetReport[];

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
        this.downloadService.targetReportLists()
            .subscribe(
                response => {
                    this.loading = false;
                    this.models = response.target_reports;
                },
                err => {
                    this.loading = false;
                }
            );
    }
}
