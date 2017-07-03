import {Component} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {ReportService} from "../../../../services/report.service";
import {Region} from "../../../../models/territory/region";
import * as moment from "moment";
import {Customer} from "../../../../models/customer/customer";
import {SapStockistSale} from "../../../../models/SAP/sap_stockist_sale";

declare let jQuery: any;

@Component({
    templateUrl: 'sap_stockist_wise.component.html',
    styleUrls: ['sap_stockist_wise.component.less']
})
export class SapStockistWiseComponent extends ListComponent {

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
    public headquarter_id: number = 0;


    /**
     * get customers
     *
     * @type {Array}
     */
    regions: Region[] = [];
    customers: Customer[] = [];

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

            this.reportService.sap_stockist_wise(this.month + 1, this.year, this.region_id, this.area_id, this.headquarter_id).subscribe(
                response => {

                    this.regions = response.regions.map(region => new Region(region));

                    // get customers
                    let customers = response.customers.map(cus => new Customer(cus));

                    let last_month_sale = response.last_month_sale.map(lms => new SapStockistSale(lms));
                    let last_month_dexona_sale = response.last_month_sale.map(lmds => new SapStockistSale(lmds));
                    let yearly_sales = response.last_month_sale.map(ys => new SapStockistSale(ys));
                    let yearly_dexona_sales = response.last_month_sale.map(yds => new SapStockistSale(yds));

                    this.prepareData(customers, yearly_sales, yearly_dexona_sales, last_month_sale, last_month_dexona_sale);

                    this.loading = false;
                },
                err => {
                    this.loading = false;
                }
            );

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
        }
    }

    /**
     *
     * @param customers
     * @param yearly_sales
     * @param yearly_dexona_sales
     * @param last_month_sale
     * @param last_month_dexona_sale
     */
    prepareData(customers: Customer[], yearly_sales: SapStockistSale[], yearly_dexona_sales: SapStockistSale[],
                last_month_sale :SapStockistSale[], last_month_dexona_sale: SapStockistSale[]) {

        // add customers  to individual hq
        customers.map(cus => {
            yearly_sales.map(ys => {
                if(cus.code == ys.stockist_code){
                    cus.last_year_sale = ys.total_net_amt;
                }
            });

            yearly_dexona_sales.map(yds => {
                if(cus.code == yds.stockist_code){
                    cus.last_year_dexona_sale = yds.total_net_amt;
                }
            });

            last_month_sale.map(lms => {
                if(cus.code == lms.stockist_code){
                    cus.last_month_sale = lms.total_net_amt;
                }
            });

            last_month_dexona_sale.map(lmds => {
                if(cus.code == lmds.stockist_code){
                    cus.last_month_dexona_sale = lmds.total_net_amt;
                }
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
