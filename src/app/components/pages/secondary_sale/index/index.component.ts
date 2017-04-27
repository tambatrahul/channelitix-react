import {Component} from "@angular/core";
import * as moment from "moment";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {SecondarySale} from "../../../../models/sale/secondary_sale";
import {SecondarySaleService} from "../../../../services/sale.service";
import {Customer} from "../../../../models/customer/customer";
declare let jQuery: any;

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class SecondarySaleComponent extends ListComponent {

    /**
     * year and month for calendar
     * @type {number}
     */
    public month: number;
    public year: number;

    /**
     * get title of table
     * @returns {string}
     */
    get title(): string {
        return moment().year(this.year).month(this.month).format("MMMM, YYYY");
    }

    /**
     * secondary sales
     *
     * @type {Array}
     */
    public secondary_sales: SecondarySale[] = [];

    /**
     * User Component Constructor
     *
     */
    constructor(private saleService: SecondarySaleService, public _service: AuthService) {
        super(_service);
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        this.month = moment().month();
        this.year = moment().year();
        super.ngOnInit();
    }

    /**
     * fetch customer secondary sales from server
     */
    fetch() {
        this.loading = true;
        this.saleService.monthly(this.month + 1, this.year).subscribe(
            response => {
                this.loading = false;

                // convert to models
                let secondary_sales = response.secondary_sales.map(function (user, index) {
                    return new SecondarySale(user);
                });

                // convert to models
                let customers = response.customers.map(function (customer, index) {
                    return new Customer(customer);
                });

                // format data for display
                this.formatSecondarySale(customers, secondary_sales);
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * format secondary sales
     * @param customers
     * @param secondary_sales
     */
    protected formatSecondarySale(customers: Customer[], secondary_sales: SecondarySale[]) {
        for (let cus of customers) {
            let present = false;
            for (let sale of secondary_sales) {
                if (cus.id == sale.customer_id) {
                    present = true;
                    break;
                }
            }
            if (!present) {
                secondary_sales.push(new SecondarySale({
                    customer: cus,
                    customer_id: cus.id,
                    sum_secondary_sale: 0
                }))
            }
        }

        this.secondary_sales = secondary_sales;
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
}
