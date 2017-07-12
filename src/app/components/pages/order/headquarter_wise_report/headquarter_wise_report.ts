import {Component} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {ReportService} from "../../../../services/report.service";
import {Region} from "../../../../models/territory/region";
import * as moment from "moment";
import {Customer} from "../../../../models/customer/customer";
import {Visit} from "../../../../models/visit/visit";
import {SecondarySale} from "../../../../models/sale/secondary_sale";
import {Target} from "../../../../models/SAP/target";

declare let jQuery: any;

@Component({
    templateUrl: 'headquarter_wise_report.html',
    styleUrls: ['headquarter_wise_report.less']
})
export class HeadQuarterWiseReportComponent extends ListComponent {

    excel_loaded: boolean = false;

    /**
     * year and month for calendar
     * @type {number}
     */
    public month: number;
    public year: number;

    /**
     * region, area & headquarter
     */
    public region_id: number = 0;
    public area_id: number = 0;


    /**
     * get regions
     *
     * @type {Array}
     */
    regions: Region[] = [];

    /**
     * User Component Constructor
     */
    constructor(public _service: AuthService, public reportService: ReportService) {
        super(_service);
    }

    /**
     * on load of call fetch
     */
    ngOnInit() {
        this.month = moment().month();
        this.year = moment().year();

        super.ngOnInit();
    }

    /**
     * load users for logged in user
     */
    fetch() {
        if (this.month && this.year) {
            this.loading = true;
            this.reportService.region_wise_sales(this.month + 1, this.year, this.region_id, this.area_id).subscribe(
                response => {
                    let regions = response.regions.map(region => new Region(region));
                    let secondary_sales = response.secondary_sales.map(sale => new SecondarySale(sale));
                    let visits = response.visits.map(visit => new Visit(visit));
                    let customers_count = response.targets.map(target => new Target(target));
                    let customers = response.customers.map(cus => new Customer(cus));

                    this.prepareData(regions, secondary_sales, customers, visits, customers_count);

                    this.loading = false;

                    // show excel download
                    setTimeout(() => {
                        if (!this.excel_loaded) {
                            this.excel_loaded = true;
                            jQuery("table").tableExport({
                                formats: ['xlsx'],
                                bootstrap: true,
                                position: "top"
                            });
                        }
                    }, 1000);

                },
                err => {
                    this.loading = false;
                }
            );
        }
    }

    /**
     *
     * @param regions
     * @param secondary_Sales
     * @param customers
     * @param visits
     * @param customers_count
     */
    prepareData(regions: Region[], secondary_Sales: SecondarySale[], customers: Customer[],
                visits: Visit[], customers_count: Target[]) {

        // add customers  to individual hq

        regions.map(region => {
            region.areas.map(area => {
                area.headquarters.map(headquarter => {
                    secondary_Sales.map(sale => {
                        if (sale.hq_headquarter_id == headquarter.id)
                            headquarter.customer_count = sale.customer_count;
                    });

                    customers.map(cus => {
                        if (cus.hq_headquarter_id == headquarter.id)
                            headquarter.total_customers = cus.total_customers;
                    });

                    visits.map(vis => {
                        if (vis.hq_headquarter_id == headquarter.id)
                            headquarter.visit_count = vis.visit_count;
                    });

                    customers_count.map(target => {
                        if (target.hq_headquarter_id == headquarter.id) {
                            headquarter.order_count = target.order_count;
                            headquarter.total_net_amount = target.total_net_amount;
                        }
                    });

                    if (area.id == headquarter.hq_area_id) {
                        area.area_total_visits += headquarter.visit_count;
                        area.area_total_orders += headquarter.order_count;
                        area.area_total_orders_amount += headquarter.total_net_amount;
                        area.area_total_customers += headquarter.total_customers;
                        area.area_total_customers_ordered += headquarter.customer_count;
                    }

                    if (region.id == area.hq_region_id) {
                        region.region_total_visits += headquarter.visit_count;
                        region.region_total_orders += headquarter.order_count;
                        region.region_total_orders_amount += headquarter.total_net_amount;
                        region.region_total_customers += headquarter.total_customers;
                        region.region_total_customers_ordered += headquarter.customer_count;
                    }
                });
            });
        });

        if (this.region_id && this.region_id > 0)
            regions = regions.filter(region => region.id == this.region_id);

        if (this.area_id && this.area_id > 0) {
            regions.map(region => {
                region.areas = region.areas.filter(a => a.id == this.area_id);
            });
        }

        this.regions = regions;
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
        this.fetch();
    }
}
