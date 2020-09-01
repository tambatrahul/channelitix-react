import {Component, Input, Output} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {DownloadService} from "../../../../services/download.service";
import {Stockist} from "../../../../models/download/stockist";

@Component({
    selector: 'stockist-report-select',
    templateUrl: 'stockist_report_select.component.html',
    inputs: ['refresh']
})
export class StockistReportSelectComponent extends BaseSelectComponent {

    /**
     * Title of input select field
     */
    @Input()
    title: string = "Stockist POB Report";

    /**
     * First value of options
     */
    @Input()
    first_value: string = "Select Stockist POB Report";

    /**
     * stockist report list
     *
     * @type {Array}
     */
    stockists: Stockist[];

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
     * fetch stockist from constants
     */
    fetch() {
        this.loading = true;
        this.downloadService.stockistReportLists()
            .subscribe(
                response => {
                    this.loading = false;
                    this.models = response.stockists;
                },
                err => {
                    this.loading = false;
                }
            );
    }
}
