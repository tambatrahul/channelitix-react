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
    month: number;


    /**
     * year
     */
    year: number;

    /**
     * total values
     */
    opening: number = 0;
    closing: number = 0;
    adjustment: number = 0;
    secondary_sale: number = 0;
    secondary_value: number = 0;
    closing_value: number = 0;

    /**
     * title of page
     *
     * @returns {string}
     */
    public get title() {
        return moment().month(this.month).format('MMMM') + ", " + this.year;
    }

    /**
     * headquarter id
     */
    public _hq_id: number;
    public _area_id: number;
    public _region_id: number;
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
            this._hq_id = params['hq_id'];
            this._area_id = params['area_id'];
            this._region_id = params['region_id'];
            this.month = parseInt(params['month']);
            this.year = parseInt(params['year']);
            this.fetchSales()
        });
    }

    /**
     * fetch sales
     */
    fetchSales() {
        this.loading = true;
        this.saleService.product_wise(this.month + 1, this.year, this._hq_id, this._area_id, this._region_id).subscribe(
            response => {

                this.loading = false;
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
                this.loading = false;
            }
        );
    }

    /**
     * format secondary sales
     *
     * @param secondary_sales
     */
    protected formatSecondarySale(secondary_sales: SecondarySale[]) {
        // initialize totals
        this.opening = 0;
        this.closing = 0;
        this.adjustment = 0;
        this.secondary_sale = 0;
        this.secondary_value = 0;
        this.closing_value = 0;

        for (let pro of this.products) {
            for (let sale of secondary_sales) {
                if (pro.id == sale.product_id) {
                    pro.unit_price = sale.unit_price;
                    pro.opening = sale.opening;
                    pro.adjustment = sale.adjustment;
                    pro.secondary_sale = sale.secondary_sale;
                    pro.closing = sale.closing;
                    pro.uom = sale.uom;
                }
            }
            this.opening += pro.opening;
            this.closing += pro.closing;
            this.adjustment += pro.adjustment;
            this.secondary_sale += pro.secondary_sale;
            this.secondary_value += (pro.secondary_sale * pro.unit_price);
            this.closing_value += (pro.closing * pro.unit_price);
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
