import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {ReportService} from "../../../../services/report.service";
import {Customer} from "../../../../models/customer/customer";
import {CustomerType} from "../../../../models/customer/customer_type";
import {Headquarter} from "../../../../models/territory/headquarter";
import {Region} from "../../../../models/territory/region";


@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class BrickWiseCustomerComponent extends ListComponent {

    /**
     * bricks
     *
     * @type {{}}
     */
    public regions = [];

    /**
     * customer types
     *
     * @type {Array}
     */
    public customer_types: CustomerType[] = [];

    /**
     * User Component Constructor
     */
    constructor(public _service: AuthService, public route: ActivatedRoute, public reportService: ReportService) {
        super(_service);
    }

    /**
     * load users for logged in user
     */
    fetch() {

        this.reportService.brick_wise_customers().subscribe(
            response => {
                this.loading = true;

                // get regions
                this.regions = response.regions.map(region => new Region(region));

                // prepare headquarters
                let headquarters = response.headquarters.map(head => new Headquarter(head));

                // prepare customers
                let customers = response.customers.map(customer => new Customer(customer));

                // prepare headquarter wise customers
                let hq_wise_customers = response.hq_wise_customers.map(customer => new Customer(customer));

                // prepare customer types
                let customer_types = response.customer_types.map(ct => new CustomerType(ct));
                this.customer_types = customer_types;

                // prepare data for table
                this.prepareData(headquarters, customers, customer_types, hq_wise_customers);
                this.loading = false;
            },
            err => {
                this.loading = false;
            }

        );
    }

    /**
     * prepare data for headquarter wise customers
     *
     * @param headquarters
     * @param customers
     * @param customer_types
     * @param hq_wise_customers
     */
    prepareData(headquarters: Headquarter[], customers: Customer[], customer_types: CustomerType[],
                hq_wise_customers: Customer[]) {

        this.regions.map(region => {
            // add customer types
            region.customer_types = this.customer_types.map(ct => new CustomerType(ct));

            region.areas.map(area => {
                // add customer types
                area.customer_types = this.customer_types.map(ct => new CustomerType(ct));

                area.headquarters.map(headquarter => {

                    // add customer types
                    headquarter.customer_types = this.customer_types.map(ct => new CustomerType(ct));

                    // add counts to customer types
                    customers.map(cus => {
                        if (headquarter.id == cus.hq_headquarter_id) {
                            headquarter.customer_types.map(ct => {
                                if (ct.id == cus.customer_type_id)
                                    ct.brick_count += cus.brick_counts
                            });
                            area.customer_types.map(ct => {
                                if (ct.id == cus.customer_type_id)
                                    ct.brick_count += cus.brick_counts
                            });
                            region.customer_types.map(ct => {
                                if (ct.id == cus.customer_type_id)
                                    ct.brick_count += cus.brick_counts
                            });
                        }
                    });

                    hq_wise_customers.map(hq_wise_cus => {
                        if (headquarter.id == hq_wise_cus.hq_headquarter_id) {
                            headquarter.customer_types.map(ct => {
                                if (ct.id == hq_wise_cus.customer_type_id)
                                    ct.customer_count += hq_wise_cus.visit_count
                            });
                            area.customer_types.map(ct => {
                                if (ct.id == hq_wise_cus.customer_type_id)
                                    ct.customer_count += hq_wise_cus.visit_count
                            });
                            region.customer_types.map(ct => {
                                if (ct.id == hq_wise_cus.customer_type_id)
                                    ct.customer_count += hq_wise_cus.visit_count
                            });
                        }
                    });

                    headquarters.map(hq => {
                        if (hq.id == headquarter.id) {
                            headquarter.total_bricks += hq.total_bricks;
                            area.total_bricks += hq.total_bricks;
                            region.total_bricks += hq.total_bricks;
                        }
                    });


                });
            });
        });
    }
}
