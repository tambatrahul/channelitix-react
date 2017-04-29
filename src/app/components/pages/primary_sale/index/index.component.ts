import {Component, ViewChild, ElementRef} from "@angular/core";
import * as moment from "moment";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {PrimarySale} from "../../../../models/sale/primary_sale";
import {PrimarySaleService} from "../../../../services/primary_sale.service";
declare let jQuery: any;

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class PrimarySaleComponent extends ListComponent {

    /**
     * loading identifier
     */
    @ViewChild('invoice_detail')
    invoice_detail: ElementRef;

    /**
     * invoice to show on popup
     */
    invoice: PrimarySale;

    /**
     * year and month for calendar
     * @type {number}
     */
    public month: number;
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
        this.saleService.monthly(this.month + 1, this.year).subscribe(
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
        jQuery(this.invoice_detail.nativeElement).modal();
    }
}
