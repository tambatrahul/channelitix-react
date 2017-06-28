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
import {Visit} from "../../../../models/visit/visit";
declare let jQuery: any;

@Component({
    templateUrl: 'synergy_stockist_wise_pob.component.html',
    styleUrls: ['synergy_stockist_wise_pob.component.less']
})
export class SynergyStockistWisePobComponent extends ListComponent {

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
        if (this._service.user.username == 'abbottadmin') {
            this.regionChanged(1);
        }
    }

    /**
     * load users for logged in user
     */
    fetch() {
        if (this.region_id && this.month && this.year) {
            this.loading = true;
            this.reportService.synergy_stockist_wise_pob(this.month + 1, this.year,
                this.region_id, this.area_id, this.headquarter_id).subscribe(
                response => {
                    this.loading = false;

                    // customers
                    let all_customers = response.customers.map(cus => new Customer(cus));

                    // visit list
                    let visits = response.visits.map(visit => new Visit(visit));

                    // prepare visits and orders
                    let orders = response.orders.map(order => new Order(order));

                    // prepare data
                    this.prepareData(orders, visits, all_customers);
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
     * @param visits
     * @param all_customers
     */
    prepareData(orders: Order[], visits: Visit[], all_customers: Customer[]) {
        // prepare customers
        let customers = {};
        this.all_total = 0;

        // add all customers
        all_customers.map(cus => {
            customers[cus.id] = cus;
        });

        // prepare list of customers with POB
        orders.map(order => {
            if (customers[order.delivered_by_synergy])
                customers[order.delivered_by_synergy].total_pob += order.order_total_count;
            else{
                customers[order.delivered_by_synergy] = order.delivered_by_synergy_user;
                customers[order.delivered_by_synergy].total_pob += order.order_total_count;
            }

            this.all_total += order.order_total_count;
        });

        // prepare list of visits for customers
        visits.map(visit => {
            customers[visit.customer_id].days = visit.days;
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
