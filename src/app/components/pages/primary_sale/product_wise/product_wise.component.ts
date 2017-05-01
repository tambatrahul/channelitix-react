import {Component, Input} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {PrimarySaleService} from "../../../../services/primary_sale.service";
import {InvoiceDetail} from "../../../../models/SAP/invoice_detail";
declare let jQuery: any;

@Component({
    selector: 'product-wise',
    templateUrl: 'product_wise.component.html',
    styleUrls: ['product_wise.component.less']
})
export class ProductWiseComponent extends ListComponent {

    /**
     * title for form
     *
     * @type {string}
     */
    title: string = "";

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
     * invoice detail
     *
     * @type {Array}
     */
    public invoice_details: InvoiceDetail[] = [];


    /**
     * Monthly Tour Program Constructor
     *
     * @param _service
     */
    constructor(private saleService: PrimarySaleService, public _service: AuthService) {
        super(_service);
    }

    fetch() {
        this.loading = true;
        this.saleService.monthly_product(this._month + 1, this._year).subscribe(
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
}
