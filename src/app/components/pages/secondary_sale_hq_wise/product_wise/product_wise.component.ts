import {Component} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {SecondarySaleService} from "../../../../services/secondary_sale.service";
import {SecondarySale} from "../../../../models/sale/secondary_sale";
import {Product} from "../../../../models/order/product";
import {ActivatedRoute} from "@angular/router";
import * as moment from "moment";
import {Headquarter} from "../../../../models/territory/headquarter";
declare let jQuery: any;

@Component({
    templateUrl: 'product_wise.component.html',
    styleUrls: ['product_wise.component.less']
})
export class ProductWiseHqComponent extends ListComponent {

    /**
     * year and month for calendar
     * @type {number}
     */
    _month: number;
    public set month(month: number) {
        this._month = month;
    }

    public get(): number {
        return this._month;
    }

    /**
     * year
     */
    public year: number;

    /**
     * title of page
     *
     * @returns {string}
     */
    public get title() {
        return moment().month(this._month - 1).format('MMMM') + ", " + this.year;
    }

    /**
     * headquarter id
     */
    public _hq_id: number;
    public headquarter: Headquarter;

    /**
     * secondary sales
     *
     * @type {Array}
     */
    public products: Product[] = [];


    /**
     * User Component Constructor
     *
     */
    constructor(private saleService: SecondarySaleService, public _service: AuthService, public route: ActivatedRoute) {
        super(_service);
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        super.ngOnInit();
    }

    /**
     * fetch customer secondary sales from server
     */
    fetch() {
        this.route.params.subscribe(params => {
            this._hq_id = params['id'];
            this.month = parseInt(params['month']);
            this.year = parseInt(params['year']);
            this.fetchSales()
        });
    }

    /**
     * fetch sales
     */
    fetchSales() {

        this.saleService.product_wise(this._month, this.year, this._hq_id).subscribe(
            response => {

                // convert to models
                let secondary_sales = response.secondary_sales.map(function (ss, index) {
                    return new SecondarySale(ss);
                });

                // convert to models
                this.products = response.products.map(function (product, index) {
                    return new Product(product);
                });

                // format data for display
                this.formatSecondarySale(secondary_sales);
            },
            err => {

            }
        );
    }

    /**
     * format secondary sales
     *
     * @param secondary_sales
     */
    protected formatSecondarySale(secondary_sales: SecondarySale[]) {
        for (let pro of this.products) {
            for (let sale of secondary_sales) {
                if (pro.id == sale.product_id) {
                    pro.unit_price = sale.unit_price;
                    pro.opening = sale.opening;
                    pro.adjustment = sale.adjustment;
                    pro.secondary_sale = sale.secondary_sale;
                    pro.closing = sale.closing;
                }
            }
        }
    }

    /**
     * month and year changed
     *
     * @param date
     */
    monthYearChanged(date) {
        this.month = date.month;
        this.year = date.year;
        this.fetchSales();
    }
}
