import {Component, Input, Output} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {DownloadService} from "../../../../services/download.service";
import {BrickDownload} from "../../../../models/download/brick_download";

@Component({
    selector: 'brick-report-select',
    templateUrl: 'brick_report_select.component.html',
    inputs: ['refresh']
})
export class BrickReportSelectComponent extends BaseSelectComponent {

    /**
     * Title of input select field
     */
    @Input()
    title: string = "Brick Working Report";

    /**
     * First value of options
     */
    @Input()
    first_value: string = "Select Brick Working Report";

    /**
     * brick report list
     *
     * @type {Array}
     */
    brick_downloads: BrickDownload[];

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
     * fetch brick report list
     */
    fetch() {
        this.loading = true;
        this.downloadService.brickReportLists()
            .subscribe(
                response => {
                    this.loading = false;
                    this.models = response.brick_downloads;
                },
                err => {
                    this.loading = false;
                }
            );
    }
}
