import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {ReportService} from "../../../../services/report.service";
import {Customer} from "../../../../models/customer/customer";
import {CustomerType} from "../../../../models/customer/customer_type";
import {Headquarter} from "../../../../models/territory/headquarter";


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
                this.loading = false;

                // prepare headquarters
                let headquarters = response.headquarters.map(head => new Headquarter(head));

                // prepare customers
                let customers = response.customers.map(customer => new Customer(customer));

                // prepare customer types
                let customer_types = response.customer_types.map(ct => new CustomerType(ct));
                this.customer_types = customer_types;

                // prepare data for table
                this.prepareData(headquarters, customers, customer_types);
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
     */
    prepareData(headquarters: Headquarter[], customers: Customer[], customer_types: CustomerType[]) {

        // prepare headquarters
        let regions = {};
        headquarters.map(hq => {
            if (!regions.hasOwnProperty(hq.hq_area.hq_region.id))
                regions[hq.hq_area.hq_region.id] = hq.hq_area.hq_region;

            if (!regions[hq.hq_area.hq_region.id].area_objects.hasOwnProperty(hq.hq_area.id))
                regions[hq.hq_area.hq_region.id].area_objects[hq.hq_area.id] = hq.hq_area;

            // add customer type
            hq.customer_types = customer_types.map(ct => new CustomerType(ct));
            regions[hq.hq_area.hq_region.id].area_objects[hq.hq_area.id].headquarters.push(hq);
        });

        // add counts to customer types
        customers.map(cus => {
            regions[cus.hq_region_id].area_objects[cus.hq_area_id].headquarters.map(hq => {
                if (hq.id == cus.hq_headquarter_id) {
                    hq.customer_types.map(ct => {
                        if (ct.id == cus.customer_type_id)
                            ct.brick_count = cus.brick_counts
                    })
                }
            });
        });

        // set
        this.regions = [];
        for(let i in regions) {
            let region = regions[i];
            for(let j in region.area_objects) {
                region.areas.push(region.area_objects[j]);
            }
            this.regions.push(region);
        }

    }
}
