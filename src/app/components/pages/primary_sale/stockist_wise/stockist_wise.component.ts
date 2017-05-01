import {Component, Input} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {PrimarySale} from "../../../../models/sale/primary_sale";
import {PrimarySaleService} from "../../../../services/primary_sale.service";
declare let jQuery: any;

@Component({
    selector: 'stockist-wise',
    templateUrl: 'stockist_wise.component.html',
    styleUrls: ['stockist_wise.component.less']
})
export class StockistWiseComponent extends ListComponent {

    /**
     * title for form
     *
     * @type {string}
     */
    title: string = "";

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
     * primary sales
     *
     * @type {Array}
     */
    public primary_sales: PrimarySale[] = [];

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
        this.saleService.monthly_stockist(this.month + 1, this.year).subscribe(
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
}
