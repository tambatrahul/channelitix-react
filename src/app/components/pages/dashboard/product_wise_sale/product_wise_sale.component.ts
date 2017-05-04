import {Component, Input} from "@angular/core";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {ReportService} from "../../../../services/report.service";
import {Performance} from "../../../../models/SAP/performance";
import {Product} from "../../../../models/order/product";
@Component({
    selector: 'product-wise-sale',
    styleUrls: ['product_wise_sale.component.less'],
    templateUrl: 'product_wise_sale.component.html',
})
export class ProductWiseSaleComponent extends ListComponent {

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

    /**
     * products wise performance
     */
    products: Product[];


    constructor(public _service: AuthService, private reportService: ReportService) {
        super(_service);
    }

    /**
     * fetch counts from server
     */
    protected fetch() {
        if (this._month && this._year) {
            this.loading = true;
            this.reportService.product_wise_sale(this._month + 1, this._year).subscribe(
                response => {
                    this.formatData(new Performance(response.performance));
                }, err => {
                    this.loading = false;
                }
            );
        }
    }

    /**
     * format performance data
     */
    protected formatData(performance: Performance) {
        // get products
        let products: Product[] = performance.products;

        // set target values
        performance.targets.map(function (target) {
            products.map(function(product) {
                if (product.id == target.product_id)
                    product.target = target.total_target;
            })
        });

        // set performance values
        performance.secondary_sales.map(function (ss) {
            products.map(function(product) {
                if (product.id == ss.product_id)
                    product.performance = ss.total_amount;
            })
        });

        this.products = products;
    }
}
