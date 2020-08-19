import {Component, Input, Output} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {DownloadService} from "../../../../services/download.service";
import {PrimaryDownload} from "../../../../models/download/primary_download";

@Component({
    selector: 'primary-report-select',
    templateUrl: 'primary_report_select.component.html',
    inputs: ['refresh']
})
export class PrimaryReportSelectComponent extends BaseSelectComponent {

    /**
     * Title of input select field
     */
    @Input()
    title: string = "Select Primary Report";

    /**
     * First value of options
     */
    @Input()
    first_value: string = "Select Primary Report";

    /**
     * primary report list
     *
     * @type {Array}
     */
    primary_downloads: PrimaryDownload[];

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
     * fetch primary from constants
     */
    fetch() {
        this.loading = true;
        this.downloadService.primaryReportLists()
            .subscribe(
                response => {
                    this.loading = false;
                    this.models = response.primary_downloads;
                },
                err => {
                    this.loading = false;
                }
            );
    }
}
