import {Component, Input, Output} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {DownloadService} from "../../../../services/download.service";
import {InputReport} from "../../../../models/download/input_report";

@Component({
    selector: 'input-report-select',
    templateUrl: 'input_report_select.component.html',
    inputs: ['refresh']
})
export class InputReportSelectComponent extends BaseSelectComponent {

    /**
     * Title of input select field
     */
    @Input()
    title: string = "Select Input Report";

    /**
     * First value of options
     */
    @Input()
    first_value: string = "Select Input Report";

    /**
     * Input report list
     *
     * @type {Array}
     */
    input_reports: InputReport[];

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
        this.downloadService.inputReportLists()
            .subscribe(
                response => {
                    this.loading = false;
                    this.models = response.input_reports;
                },
                err => {
                    this.loading = false;
                }
            );
    }
}
