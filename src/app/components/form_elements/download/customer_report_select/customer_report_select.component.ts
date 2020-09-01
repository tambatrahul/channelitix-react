import {Component, Input, Output} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {DownloadService} from "../../../../services/download.service";
import {CustomerReport} from "../../../../models/download/customer_report";

@Component({
    selector: 'customer-report-select',
    templateUrl: 'customer_report_select.component.html',
    inputs: ['refresh']
})
export class CustomerReportSelectComponent extends BaseSelectComponent {

    /**
     * Title of input select field
     */
    @Input()
    title: string = "Customer Detailed Report";

    /**
     * First value of options
     */
    @Input()
    first_value: string = "Select Customer Detailed Report";

    /**
     * Customer report list
     *
     * @type {Array}
     */
    customer_reports: CustomerReport[];

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
        this.downloadService.customerReportLists()
            .subscribe(
                response => {
                    this.loading = false;
                    this.models = response.customer_reports;
                },
                err => {
                    this.loading = false;
                }
            );
    }
}
