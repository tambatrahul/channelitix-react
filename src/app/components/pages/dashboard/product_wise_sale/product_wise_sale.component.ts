import {Component, Input, Output, EventEmitter} from "@angular/core";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {ReportService} from "../../../../services/report.service";
import {Product} from "../../../../models/order/product";
@Component({
    selector: 'product-wise-sale',
    styleUrls: ['product_wise_sale.component.less'],
    templateUrl: 'product_wise_sale.component.html',
})
export class ProductWiseSaleComponent extends ListComponent {

    /**
     * get all Product Wise sale
     *
     * @type {}
     */
    product_wise_sale = [{
        product: String,
        target: 0,
        actual_sale: 0
    }];

    /**
     * dates
     *
     * @type {}
     */
    _dates = {from_date: '', to_date: '', year: ''};
    @Input()
    set dates(dates) {
        this._dates = dates;
        this.fetch();
    }

    constructor(public _service: AuthService, private reportService: ReportService) {
        super(_service);
    }

    /**
     * fetch counts from server
     */
    protected fetch() {
        this.reportService.product_wise_sale(this._dates.from_date, this._dates.to_date, this._dates.year).subscribe(
            response => {
                this.product_wise_sale = response.product_wise_sale;
            }, err => {
            }
        );
    }

}
