import {Component} from "@angular/core";
import * as moment from "moment";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {SecondarySale} from "../../../../models/sale/secondary_sale";
import {SecondarySaleService} from "../../../../services/secondary_sale.service";
import {Customer} from "../../../../models/customer/customer";
import {Region} from "../../../../models/territory/region";
declare let jQuery: any;

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class SecondarySaleZSMComponent extends ListComponent {

    /**
     * year and month for calendar
     * @type {number}
     */
    public month: number;
    public year: number;

    /**
     * bricks
     *
     * @type {{}}
     */
    public regions = [];

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
        this.saleService.monthly_count(this.month + 1, this.year).subscribe(
            response => {
                this.loading = false;

                // get regions
                this.regions = response.regions.map(region => new Region(region));

                // convert to models
                let secondary_sales = response.secondary_sales.map(sale => new SecondarySale(sale));

                // convert to models
                let customers = response.customers.map(cus => new Customer(cus));

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
        this.regions.map(region => {
            region.areas.map(area => {
                area.headquarters.map(headquarter => {

                    customers.map(cus => {
                        if (cus.hq_headquarter_id == headquarter.id)
                            headquarter.total_customers = cus.total_customers;
                    });

                    secondary_sales.map(sale => {
                        if (sale.hq_headquarter_id == headquarter.id)
                            headquarter.customer_count = sale.customer_count;
                    });

                });
            });
        });
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
