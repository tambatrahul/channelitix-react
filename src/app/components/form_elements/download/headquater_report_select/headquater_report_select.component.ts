import {Component, Input, Output} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {DownloadService} from "../../../../services/download.service";
import {HeadquaterDownload} from "../../../../models/download/headquater_download";

@Component({
    selector: 'headquater-report-select',
    templateUrl: 'headquater_report_select.component.html',
    inputs: ['refresh']
})
export class HeadquaterReportSelectComponent extends BaseSelectComponent {

    /**
     * Title of input select field
     */
    @Input()
    title: string = "Select Headquater Report";

    /**
     * First value of options
     */
    @Input()
    first_value: string = "Select Headquater Report";

    /**
     * headquater report list
     *
     * @type {Array}
     */
    headquater_downloads: HeadquaterDownload[];

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
     * fetch headquater report list
     */
    fetch() {
        this.loading = true;
        this.downloadService.headquaterReportLists()
            .subscribe(
                response => {
                    this.loading = false;
                    this.models = response.headquater_downloads;
                },
                err => {
                    this.loading = false;
                }
            );
    }
}
