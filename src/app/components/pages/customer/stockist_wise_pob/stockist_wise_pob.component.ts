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
import {Observable} from "rxjs/Rx";
declare let jQuery: any;

@Component({
    templateUrl: 'stockist_wise_pob.component.html',
    styleUrls: ['stockist_wise_pob.component.less']
})
export class StockistWisePobComponent extends ListComponent {

    excel_loaded: boolean = false;
    upload_excel;

    /**
     * bricks
     *
     * @type {{}}
     */
    public customers: Customer[] = [];
    public products: Product[] = [];
    public all_total: number = 0;

    /**
     * region, area & headquarter
     */
    public region_id: number = 0;
    public area_id: number = 0;
    public headquarter_id: number = 0;

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
        this.regionChanged(this._service.user.hq_region_id);
        this.areaChanged(this._service.user.hq_area_id);
    }

    /**
     * load users for logged in user
     */
    fetch() {
        if (this.region_id && this.month && this.year) {
            this.loading = true;
            if (this.environment.envName == 'sk_group') {
                Observable.forkJoin(
                    this.reportService.stockist_wise_pob(this.month + 1, this.year,
                        this.region_id, this.area_id, this.headquarter_id),
                    this.reportService.synergy_stockist_wise_pob(this.month + 1, this.year,
                        this.region_id, this.area_id, this.headquarter_id)
                ).subscribe(data => {
                    this.loading = false;

                    // prepare visits and orders
                    let orders = data[0].orders.map(order => new Order(order));

                    // product list
                    let products = data[0].products.map(pro => new Product(pro));

                    // prepare data
                    let customers = this.prepareData(orders, products);
                    this.addSynergyData(customers, data[1].orders.map(order => new Order(order)))
                });
            } else {
                this.reportService.stockist_wise_pob(this.month + 1, this.year,
                    this.region_id, this.area_id, this.headquarter_id).subscribe(
                    response => {
                        this.loading = false;

                        // prepare visits and orders
                        let orders = response.orders.map(order => new Order(order));

                        // product list
                        let products = response.products.map(pro => new Product(pro));

                        // prepare data
                        let customers = this.prepareData(orders, products);

                        this.customers = [];
                        for (let i in customers) {
                            let customer = customers[i];
                            this.customers.push(customer);
                        }

                        setTimeout(() => {
                            if (this.upload_excel)
                                this.upload_excel.reset();
                            else
                                this.upload_excel = jQuery("table").tableExport({
                                    formats: ['xlsx'],
                                    bootstrap: true,
                                    position: "top"
                                });
                        }, 1000);
                    },
                    err => {
                        this.loading = false;
                    }
                );
            }
        }
    }

    /**
     * add synergy details
     * @param customers
     * @param orders
     */
    addSynergyData(customers, orders: Order[]) {
        // prepare list of customers
        orders.map(order => {
            if (!customers.hasOwnProperty(order.delivered_by_synergy)) {
                customers[order.delivered_by_synergy] = order.delivered_by_synergy_user;
                customers[order.delivered_by_synergy].products = this.products.map(pro => {
                    let prod = new Product(pro);
                    prod.amount = 0;
                    return prod;
                });
            }
            customers[order.delivered_by_synergy].products.map(pro => {
                if (pro.id == order.product_id) {
                    pro.amount = order.order_total_count;
                    customers[order.delivered_by_synergy].total_pob += order.order_total_count;
                }
            });
            this.products.map(prod => {
                if (prod.id == order.product_id) {
                    prod.amount += order.order_total_count;
                    this.all_total += order.order_total_count;
                }
            });

            console.log(this.products);
        });

        this.customers = [];
        for (let i in customers) {
            let customer = customers[i];
            this.customers.push(customer);
        }

        setTimeout(() => {
            if (this.upload_excel)
                this.upload_excel.reset();
            else
                this.upload_excel = jQuery("table").tableExport({
                    formats: ['xlsx'],
                    bootstrap: true,
                    position: "top"
                });
        }, 1000);

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
        this.all_total = 0;

        // prepare list of customers
        orders.map(order => {
            if (!customers.hasOwnProperty(order.delivered_by)) {
                customers[order.delivered_by] = order.delivered_by_user;
                customers[order.delivered_by].products = products.map(pro => {
                    let prod = new Product(pro);
                    prod.amount = 0;
                    return prod;
                });
            }
            customers[order.delivered_by].products.map(pro => {
                if (pro.id == order.product_id) {
                    pro.amount = order.order_total_count;
                    customers[order.delivered_by].total_pob += order.order_total_count;
                }
            });
            products.map(prod => {
                if (prod.id == order.product_id) {
                    prod.amount += order.order_total_count;
                    this.all_total += order.order_total_count;
                }
            });
        });

        this.products = products;

        return customers;
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
        this.fetch();
    }

    /**
     * when area is changed filter list of customer
     * @param area_id
     */
    areaChanged(area_id) {
        this.area_id = area_id;
        this.headquarterChanged(0);
        this.fetch();
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
