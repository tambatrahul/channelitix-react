import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {ReportService} from "../../../../services/report.service";
import {CustomerType} from "../../../../models/customer/customer_type";
import * as moment from "moment";
import {Order} from "../../../../models/order/order";
import {Product} from "../../../../models/order/product";
import {Customer} from "../../../../models/customer/customer";


@Component({
    templateUrl: 'stockist_wise_pob.component.html',
    styleUrls: ['stockist_wise_pob.component.less']
})
export class StockistWisePobComponent extends ListComponent {

    /**
     * bricks
     *
     * @type {{}}
     */
    public customers: Customer[] = [];
    public products: Product[] = [];

    /**
     * region, area & headquarter
     */
    public region_id: number = 0;
    public area_id: number = 0;
    public headquarter_id: number = 1;

    /**
     * customer types
     *
     * @type {Array}
     */
    public customer_types: CustomerType[] = [];

    /**
     * year and month for calendar
     * @type {number}
     */
    public month: number;
    public year: number;

    /**
     * User Component Constructor
     */
    constructor(public _service: AuthService, public route: ActivatedRoute, public reportService: ReportService) {
        super(_service);
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        super.ngOnInit();
        this.month = moment().month();
        this.year = moment().year();
    }

    /**
     * load users for logged in user
     */
    fetch() {
        if (this.headquarter_id && this.month && this.year) {
            this.loading = true;
            this.reportService.stockist_wise_pob(this.month + 1, this.year,
                this.region_id, this.area_id, this.headquarter_id).subscribe(
                response => {
                    this.loading = false;

                    // prepare visits and orders
                    let orders = response.orders.map(order => new Order(order));

                    // product list
                    let products = response.products.map(pro => new Product(pro));

                    // prepare data
                    this.prepareData(orders, products);
                },
                err => {
                    this.loading = false;
                }
            );
        }
    }

    /**
     * prepare data
     *
     * @param orders
     * @param products
     */
    prepareData(orders: Order[], products: Product[]) {
        // prepare customers
        let customers = {};

        // prepare list of customers
        orders.map(order => {
            if (!customers.hasOwnProperty(order.delivered_by)) {
                customers[order.delivered_by] = order.delivered_by_user;
                customers[order.delivered_by].products = products.map(pro => new Product(pro));
            }
            customers[order.delivered_by].products.map(pro => {
                if (pro.id == order.product_id)
                    pro.amount = order.order_total_count;
            });
        });

        console.log(customers);
        this.customers = [];
        for (let i in customers) {
            let customer = customers[i];
            this.customers.push(customer);
        }
        this.products = products;
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
     * when region is changed filter list of customer
     * @param region_id
     */
    regionChanged(region_id) {
        this.region_id = region_id;
        this.areaChanged(0);
    }

    /**
     * when area is changed filter list of customer
     * @param area_id
     */
    areaChanged(area_id) {
        this.area_id = area_id;
        this.headquarterChanged(0);
    }

    /**
     * when headquarter is changed filter list of customer
     * @param headquarter_id
     */
    headquarterChanged(headquarter_id) {
        this.headquarter_id = headquarter_id;
        this.fetch();
    }
}
