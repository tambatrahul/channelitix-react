import {Component, ViewChild, ElementRef} from "@angular/core";
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
     * loading identifier
     */
    @ViewChild('missing_customer_table')
    missing_customer_table: ElementRef;

    /**
     * year and month for calendar
     * @type {number}
     */
    public month: number;
    public year: number;

    /**
     * year and month for calendar
     * @type {number}
     */
    public headquarter_id: number;
    public area_id: number;
    public region_id: number;

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
            region.total_customers = 0;
            region.customer_count = 0;
            region.areas.map(area => {
                area.total_customers = 0;
                area.customer_count = 0;
                area.headquarters.map(headquarter => {

                    customers.map(cus => {
                        if (cus.hq_headquarter_id == headquarter.id) {
                            headquarter.total_customers = cus.total_customers;
                            area.total_customers += cus.total_customers;
                            region.total_customers += cus.total_customers;
                        }
                    });

                    secondary_sales.map(sale => {
                        if (sale.hq_headquarter_id == headquarter.id) {
                            headquarter.customer_count = sale.customer_count;
                            area.customer_count += sale.customer_count;
                            region.customer_count += sale.customer_count;
                        }
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

    /**
     *
     * @param headquarter_id
     * @param area_id
     * @param region_id
     */
    selectHeadquarter(headquarter_id: number, area_id: number, region_id: number) {
        this.region_id = region_id;
        this.area_id = area_id;
        this.headquarter_id = headquarter_id;
        jQuery(this.missing_customer_table.nativeElement).modal();
    }
}
