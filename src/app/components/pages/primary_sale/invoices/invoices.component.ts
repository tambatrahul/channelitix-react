import {Component, ViewChild, ElementRef, Input} from "@angular/core";
import * as moment from "moment";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {PrimarySaleService} from "../../../../services/primary_sale.service";
import {InvoiceDetail} from "../../../../models/SAP/invoice_detail";
declare let jQuery: any;

@Component({
    selector: 'invoices',
    templateUrl: 'invoices.component.html',
    styleUrls: ['invoices.component.less']
})
export class InvoicesComponent extends ListComponent {

    /**
     * loading identifier
     */
    @ViewChild('invoices')
    invoices: ElementRef;

    /**
     * invoice to show on popup
     */
    invoice: InvoiceDetail;

    public _month: number;
    @Input()
    set month(month: number) {
        this._month = month;
        this.fetch();
    }

    public _year: number;
    @Input()
    set year(year: number) {
        this._year = year;
        this.fetch();
    }

    /**
     * get title of table
     * @returns {string}
     */
    get title(): string {
        return moment().year(this.year).month(this.month).format("MMMM, YYYY");
    }

    /**
     * primary sales
     *
     * @type {Array}
     */
    public invoice_details: InvoiceDetail[] = [];

    /**
     * User Component Constructor
     *
     */
    constructor(private saleService: PrimarySaleService, public _service: AuthService) {
        super(_service);
    }

    /**
     * fetch customer secondary sales from server
     */
    fetch() {
        this.loading = true;
        this.saleService.monthly_invoice(this._month + 1, this._year).subscribe(
            response => {
                this.loading = false;

                // convert to models
                this.invoice_details = response.invoice_details.map(function (user, index) {
                    return new InvoiceDetail(user);
                });
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * month and year changed
     *
     * @param date
     */
    monthYearChanged(date) {
        this.month = date.month;
        this.year = date.year;
        this.fetch();
    }

    /**
     * show all tour for user
     * @param invoice
     */
    showInvoice(invoice: InvoiceDetail) {
        this.invoice = invoice;
        jQuery(this.invoices.nativeElement).modal();
    }
}
