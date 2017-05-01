import {Component, ViewChild, ElementRef, Input} from "@angular/core";
import * as moment from "moment";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {PrimarySale} from "../../../../models/sale/primary_sale";
import {PrimarySaleService} from "../../../../services/primary_sale.service";
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
     * Tours
     */
    @Input()
    invoice: PrimarySale;

    @Input()
    public month: number;

    @Input()
    public year: number;

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
    public primary_sales: PrimarySale[] = [];

    /**
     * User Component Constructor
     *
     */
    constructor(private saleService: PrimarySaleService, public _service: AuthService) {
        super(_service);
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        this.month = moment().month();
        this.year = moment().year();
        super.ngOnInit();
    }

    /**
     * fetch customer secondary sales from server
     */
    fetch() {
        this.loading = true;
        this.saleService.monthly_invoice(this.month + 1, this.year).subscribe(
            response => {
                this.loading = false;

                // convert to models
                this.primary_sales = response.primary_sales.map(function (user, index) {
                    return new PrimarySale(user);
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
    showInvoice(invoice: PrimarySale) {
        this.invoice = invoice;
        jQuery(this.invoices.nativeElement).modal();
    }
}