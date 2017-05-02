import {Component, Input, Output, EventEmitter} from "@angular/core";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {ReportService} from "../../../../services/report.service";
import {Product} from "../../../../models/order/product";
@Component({
    selector: 'product-wise-sale',
    styleUrls: ['../../visit/index/index.component.less'],
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
     * month of invoice
     */
    public _month: number;
    @Input()
    set month(month: number) {
        this._month = month;
        this.fetch();
    }

    /**
     * year of invoice
     */
    public _year: number;
    @Input()
    set year(year: number) {
        this._year = year;
    }


    constructor(public _service: AuthService, private reportService: ReportService) {
        super(_service);
    }

    /**
     * fetch counts from server
     */
    protected fetch() {
        this.reportService.product_wise_sale(this._month, this._year).subscribe(
            response => {
                this.product_wise_sale = response.product_wise_sale;
            }, err => {
            }
        );
    }

}
