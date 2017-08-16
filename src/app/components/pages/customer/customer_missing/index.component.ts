import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import * as moment from "moment";
import {ListComponent} from "../../../base/list.component";
import {Territory} from "../../../../models/territory/territory";
import {Headquarter} from "../../../../models/territory/headquarter";
import {AuthService} from "../../../../services/AuthService";
import {CustomerService} from "../../../../services/customer.service";
import {Customer} from "../../../../models/customer/customer";
import {environment} from "../../../../../environments/environment";
declare let jQuery: any;

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class CustomerMissingComponent extends ListComponent {

    /**
     * year and month for calendar
     * @type {number}
     */
    public month: number;
    public year: number;
    public territories: Territory[] = [];

    /**
     * region, territory, area, headquarter & brick id
     */
    public region_id: number = 0;
    public area_id: number = 0;
    public headquarter_id: number = 0;
    public _headquarters: Headquarter[] = [];
    btn_loading: boolean = false;

    /**
     * User Component Cons3tructor
     */
    constructor(public _service: AuthService, public route: ActivatedRoute, public customerService: CustomerService) {
        super(_service);
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        super.ngOnInit();
        this.month = moment().month();
        this.year = moment().year();

        if (environment.envName == 'geo') {
            if (this._service.user.role_id == 4) {
                this.region_id = this._service.user.hq_region_id;
                this.area_id = this._service.user.hq_area_id;
            }
            else if (this._service.user.role_id == 5) {
                this.region_id = this._service.user.hq_region_id;
            }
            else if (this._service.user.role_id == 3) {
                this.region_id = this._service.user.hq_region_id;
                this.area_id = this._service.user.hq_area_id;
                this.headquarter_id = this._service.user.hq_headquarter_id;
            }
        }
        else {
            if (this._service.user.role_id == 4) {
                this.region_id = this._service.user.hq_region_id;
                this.area_id = this._service.user.hq_area_id;
            }
            else if (this._service.user.role_id == 5) {
                this.region_id = this._service.user.hq_region_id;
            }
            else if (this._service.user.role_id == 3) {
                this.region_id = this._service.user.hq_region_id;
                this.area_id = this._service.user.hq_area_id;
                this.headquarter_id = this._service.user.hq_headquarter_id;
            }
        }
    }

    /**
     * load users for logged in user
     */
    fetch() {
        this.loading = true;
        this.customerService.customer_missing(this.region_id, this.area_id, this.headquarter_id, this.month + 1, this.year).subscribe(
            response => {
                // get territories
                let territories = response.territories.map(territory => new Territory(territory));

                // get customers
                let customers = response.customers.map(customer => new Customer(customer));

                // get total customers
                let total_customers = response.cus_total_customers.map(customer => new Customer(customer));

                // prepare data for display
                this.prepareData(territories, customers, total_customers);

                this.loading = false;
            }
        );

        this.loading = false;
    }

    // Prepare Data For Display
    prepareData(territories: Territory[], customers: Customer[], total_customers: Customer[]) {
        territories.map(ter => {
            ter.hq_bricks.map(brick => {
                customers.map(cus => {
                    if (brick.id == cus.hq_brick_id) {

                        if (cus.customer_type_id == 1) {
                            brick.customer_others = cus.total_count;
                        }

                        if (cus.customer_type_id == 2) {
                            brick.customer_semi = cus.total_count;
                        }

                        if (cus.customer_type_id == 3) {
                            brick.customer_retailer = cus.total_count;
                        }

                        if (cus.customer_type_id == 4) {
                            brick.customer_hub_chemist = cus.total_count;
                        }

                        if (cus.customer_type_id == 5) {
                            brick.customer_physician = cus.total_count;
                        }

                    }
                });

                total_customers.map(total_cus => {
                    if (brick.id == total_cus.hq_brick_id) {

                        if (total_cus.customer_type_id == 1) {
                            brick.total_customer_others = total_cus.total_customers;
                        }

                        if (total_cus.customer_type_id == 2) {
                            brick.total_customer_semi = total_cus.total_customers;
                        }

                        if (total_cus.customer_type_id == 3) {
                            brick.total_customer_retailer = total_cus.total_customers;
                        }

                        if (total_cus.customer_type_id == 4) {
                            brick.total_customer_hub_chemist = total_cus.total_customers;
                        }

                        if (total_cus.customer_type_id == 5) {
                            brick.total_customer_physician = total_cus.total_customers;
                        }
                    }

                });
            })
        });

        this.territories = territories;

    }

    /**
     * get headquarters
     */
    headquarters(data) {
        this._headquarters = data.headquarters;
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
        this.territories = [];
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
     * Download Excel For Executive Summary
     */
    download() {

        this.customerService.customer_missing_download(this.region_id, this.area_id, this.headquarter_id, this.month + 1, this.year).subscribe(
            response => {
                let blob: Blob = response.blob();

                // Doing it this way allows you to name the file
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = "customer_missing_report.xls";
                link.click();
            },
            err => {
            }
        );
    }
}
