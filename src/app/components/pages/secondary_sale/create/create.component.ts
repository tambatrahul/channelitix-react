import {Component} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {SecondarySaleService} from "../../../../services/secondary_sale.service";
import {SecondarySale} from "../../../../models/sale/secondary_sale";
import {Customer} from "../../../../models/customer/customer";
import {Product} from "../../../../models/order/product";
import {ActivatedRoute} from "@angular/router";
import * as moment from "moment";
declare let jQuery: any;

@Component({
    templateUrl: 'create.component.html',
    styleUrls: ['create.component.less']
})
export class SecondarySaleCreateComponent extends ListComponent {

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
     * current month & current year
     */
    public current_month: number;
    public current_year: number;

    /**
     * title of page
     *
     * @returns {string}
     */
    public get title() {
        return moment().month(this._month).format('MMMM') + ", " + this.year;
    }

    /**
     * customer id
     */
    public _customer_id: number;
    public customer: Customer;

    /**
     * secondary sales
     *
     * @type {Array}
     */
    public secondary_sales: SecondarySale[] = [];

    /**
     * editing false
     */
    editing: boolean = false;

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
        this.current_month = moment().month();
        this.current_year = moment().year();
    }

    /**
     * fetch customer secondary sales from server
     */
    fetch() {
        this.route.params.subscribe(params => {
            this._customer_id = params['id'];
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
        this.saleService.forCustomer(this._month + 1, this.year, this._customer_id).subscribe(
            response => {
                this.loading = false;

                // convert to models
                let secondary_sales = response.secondary_sales.map(function (ss, index) {
                    return new SecondarySale(ss);
                });

                // convert to models
                let products = response.products.map(function (customer, index) {
                    return new Product(customer);
                });

                // get customer
                this.customer = new Customer(response.customer);

                // format data for display
                this.formatSecondarySale(products, secondary_sales);
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * format secondary sales
     *
     * @param products
     * @param secondary_sales
     */
    protected formatSecondarySale(products: Product[], secondary_sales: SecondarySale[]) {
        for (let pro of products) {
            let present = false;
            for (let sale of secondary_sales) {
                if (pro.id == sale.product_id) {
                    present = true;
                    break;
                }
            }
            if (!present) {
                secondary_sales.push(new SecondarySale({
                    product: pro,
                    opening: 0,
                    closing: 0,
                    secondary_sale: 0,
                    adjustment: 0,
                    uom: pro.uoms[0],
                    uom_id: pro.uoms[0].id,
                    unit_price: pro.uoms[0].unit_price,
                    product_id: pro.id,
                    sum_secondary_sale: 0
                }))
            }
        }

        this.secondary_sales = secondary_sales;
    }

    /**
     * save Secondary sale
     */
    save() {
        // prepare stps to save
        let secondary_sales: SecondarySale[] = [];
        for (let ss of this.secondary_sales) {
            secondary_sales.push(new SecondarySale({
                product_id: ss.product_id,
                uom_id: ss.uom_id,
                opening: ss.opening,
                secondary_sale: ss.secondary_sale,
                adjustment: ss.adjustment,
            }));

        }

        // create to server
        this.loading = true;
        this.saleService.create(secondary_sales, this._month + 1, this.year, this._customer_id).subscribe(
            response => {
                this.loading = false;
                this.editing = false;
                this.fetch();
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * toggle editing
     */
    toggleEditing() {
        this.editing = !this.editing;
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

    /**
     * is editable
     * @returns {boolean}
     */
    get isEditable(): boolean {
        return (this._month >= this.current_month - 1) && (this.year >= this.current_year);
    }
}
