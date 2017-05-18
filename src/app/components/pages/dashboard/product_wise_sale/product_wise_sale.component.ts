import {Component, Input} from "@angular/core";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {ReportService} from "../../../../services/report.service";
import {Performance} from "../../../../models/SAP/performance";
import {Product} from "../../../../models/order/product";
import {BaseDashboardComponent} from "../base_dashboard.component";
@Component({
    selector: 'product-wise-sale',
    styleUrls: ['product_wise_sale.component.less'],
    templateUrl: 'product_wise_sale.component.html',
})
export class ProductWiseSaleComponent extends BaseDashboardComponent {

    /**
     * total target and actual
     *
     * @type {number}
     */
    total_target: number = 0;
    total_actual: number = 0;

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
            this.reportService.product_wise_sale(this._month + 1, this._year,
                this._region_ids, this._area_ids, this._headquarter_ids).subscribe(
                response => {
                    this.formatData(new Performance(response.performance));
                    this.loading = false;
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
        let self = this;

        // get products
        let products: Product[] = performance.products;

        self.total_target = 0;
        // set target values
        performance.targets.map(function (target) {
            products.map(function (product) {
                if (product.id == target.product_id) {
                    product.target = target.total_target;
                    self.total_target += target.total_target;
                }
            });
        });

        self.total_actual = 0;
        // set performance values
        performance.secondary_sales.map(function (ss) {
            products.map(function (product) {
                if (product.id == ss.product_id) {
                    product.performance = ss.total_amount;
                    self.total_actual += ss.total_amount;
                }
            })
        });

        this.products = products;
    }
}
