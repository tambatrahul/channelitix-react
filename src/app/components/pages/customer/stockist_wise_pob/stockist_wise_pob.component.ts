import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {ReportService} from "../../../../services/report.service";
import {CustomerType} from "../../../../models/customer/customer_type";
import {Visit} from "../../../../models/visit/visit";
import * as moment from "moment";
import {Customer} from "../../../../models/customer/customer";
import {Order} from "../../../../models/order/order";


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
                    let visits = response.visits.map(visit => new Visit(visit));
                    let orders = response.orders.map(order => new Order(order));
                    let customers = response.customers.map(customer => new Customer(customer));

                    // prepare data for table
                    this.prepareData(visits, orders, customers);
                },
                err => {
                    this.loading = false;
                }
            );
        }
    }

    /**
     * prepare data for headquarter wise customers
     *
     * @param visits
     * @param orders
     * @param customers
     */
    prepareData(visits: Visit[], orders: Order[], customers: Customer[]) {

        // prepare customers
        customers.map(customer => {
            // add visits to customer
            visits.map(visit => {
                if (visit.customer_id == customer.id)
                    customer.visit_count = visit.visit_count;
            });

            // add orders to customer
            orders.map(order => {
                if (order.delivered_by == customer.id)
                    customer.order_count = order.order_total_count;
            });
        });
        this.customers = customers;
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
