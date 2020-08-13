import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {ReportService} from "../../../../services/report.service";
import {DownloadService} from '../../../../services/download.service';
import {CustomerType} from "../../../../models/customer/customer_type";
import * as moment from "moment";
import {Order} from "../../../../models/order/order";
import {PrimarySale} from "../../../../models/sale/primary_sale";
import {Product} from "../../../../models/order/product";
import {Customer} from "../../../../models/customer/customer";
import {Observable} from "rxjs/Rx";
import {Visit} from "../../../../models/visit/visit";
import {Role} from "../../../../models/role";
import {RoleCheckDirective} from "../../../../directives/role.directive";
import {Headquarter} from '../../../../models/territory/headquarter';
import {Territory} from '../../../../models/territory/territory';
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
    public primary_sale_total: number = 0;
    public _headquarters: Headquarter[] = [];
    public territories: Territory[] = [];



    /**
     * zone, region, area & headquarter
     */
    public zone_id: number = 0;
    public region_id: number = 0;
    public area_id: number = 0;
    public headquarter_id: number = 0;
    public department_id: number = 0;
    public stockist_report_id: number = 0;


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
    constructor(public _service: AuthService, public route: ActivatedRoute, public reportService: ReportService, public downloadService: DownloadService) {
        super(_service);
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        super.ngOnInit();
        this.month = moment().month();
        this.year = moment().year();

        if (this._service.user.role_id == 4) {
           this.region_id = this._service.user.hq_region_id;
           this.area_id = this._service.user.hq_area_id;
        }
        if (this._service.user.role_id == 5) {
           this.region_id = this._service.user.hq_region_id;
        }
        if (this._service.user.role_id == 6) {
           this.zone_id = this._service.user.hq_zone_id;
        }

        if (this._service.user.role_id == 7) {
           this.zone_id = 1;
        }

        if (this._service.user.departments.length > 0) {
          this.department_id = 0;
        }

        if (this._service.user.departments.length > 0 && this._service.user.role_id == 6 ) {
          this.department_id = this._service.user.departments[0].pivot.department_id;
        }

    }

  protected fetch() {
  }

  /**
     * load users for logged in user
     */
    fetch_data() {
        if (this.zone_id || this.region_id && (this.month || this.month == 0) && this.year) {
            this.loading = true;
            if (this.environment.envName == 'sk_group') {
                Observable.forkJoin(
                    this.reportService.stockist_wise_pob(this.month + 1, this.year,
                      this.zone_id, this.region_id, this.area_id, this.headquarter_id),
                    this.reportService.synergy_stockist_wise_pob(this.month + 1, this.year,
                        this.region_id, this.area_id, this.headquarter_id)
                ).subscribe(data => {
                    this.loading = false;

                    // prepare visits and orders
                    let orders = data[0].orders.map(order => new Order(order));

                    // visit list
                    let visits = data[0].visits.map(visit => new Visit(visit));

                    // customers
                    let all_customers = data[0].customers.map(cus => new Customer(cus));

                    // prepare data
                    let customers = this.prepareData(all_customers, orders, null, visits);
                    this.addSynergyData(customers, data[1].orders.map(order => new Order(order)));

                  this.customers = [];
                  for (let i in customers) {
                    let customer = customers[i];
                    this.customers.push(customer);
                  }

                });
            } else {
                this.reportService.stockist_wise_pob(this.month + 1, this.year,
                  this.zone_id, this.region_id, this.area_id, this.headquarter_id, this.department_id).subscribe(
                    response => {
                        this.loading = false;

                        // prepare visits and orders
                        let orders = response.orders.map(order => new Order(order));

                        let primary_sales = response.primary_sales.map(primary_sale => new PrimarySale(primary_sale));

                        // visit list
                        let visits = response.visits.map(visit => new Visit(visit));

                        // customers
                        let all_customers = response.customers.map(cus => new Customer(cus));


                        // prepare data
                        let customers = this.prepareData(all_customers, orders, primary_sales, visits);

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
            if (customers[order.delivered_by_synergy])
                customers[order.delivered_by_synergy].total_pob += order.order_total_count;
            else{
                customers[order.delivered_by_synergy] = order.delivered_by_synergy_user;
                customers[order.delivered_by_synergy].total_pob += order.order_total_count;
            }

            this.all_total += order.order_total_count;
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
     * @param all_customers
     * @param orders
     * @param primary_sales
     * @param visits
     */
    prepareData(all_customers: Customer[], orders: Order[], primary_sales: PrimarySale[], visits: Visit[]) {
        // prepare customers
        let customers = {};
        this.all_total = 0;
        this.primary_sale_total = 0;

        // add all customers
        all_customers.map(cus => {
            customers[cus.id] = cus;
        });

        // prepare list of customers with POB
        orders.map(order => {
            customers[order.delivered_by].total_pob += order.order_total_count;
            this.all_total += order.order_total_count;
        });

        // prepare list of visits for customers
        visits.map(visit => {
            customers[visit.customer_id].days = visit.days;
        });

        // prepare list of customers with primary sale
        if (primary_sales) {
            primary_sales.map(primary_sale => {
                customers[primary_sale.customer_id].total_primary_sale += primary_sale.total_net_amount;
                this.primary_sale_total += primary_sale.total_net_amount;
            });
        }
      console.log(customers);
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
    }

    /**
     * when zone is changed filter list of customer
     * @param zone_id
     */
    zoneChanged(zone_id) {
        this.zone_id = zone_id;
        this.regionChanged(0);

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
      this.territories = [];
    }

  /**
   * department Filter
   *
   * @param department_id
   */
  departmentChanged(department_id) {
    this.department_id = department_id;
  }

  /**
   * get headquarters
   */
  headquarters(data) {
    this._headquarters = data.headquarters;
  }

  /**
   * get stockist report id to download
   */
  stockistReportChanged(stockist_report_id) {
    this.stockist_report_id = stockist_report_id;
  }

  /**
   * Download Excel For Report
   */
  report_download() {
    let url = this.downloadService.report_download(this.stockist_report_id);
    window.open(url, "_blank");
  }
}
