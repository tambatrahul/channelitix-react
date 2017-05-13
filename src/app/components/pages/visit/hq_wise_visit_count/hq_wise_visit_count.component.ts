import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {ReportService} from "../../../../services/report.service";
import {CustomerType} from "../../../../models/customer/customer_type";
import {Headquarter} from "../../../../models/territory/headquarter";
import {Visit} from "../../../../models/visit/visit";
import * as moment from "moment";
import {Customer} from "../../../../models/customer/customer";


@Component({
    templateUrl: 'hq_wise_visit_count.component.html',
    styleUrls: ['hq_wise_visit_count.component.less']
})
export class HQWiseVisitComponent extends ListComponent {

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
    }

    /**
     * load users for logged in user
     */
    fetch() {
        this.loading = true;
        this.reportService.hq_wise_visit_counts(this.month + 1, this.year).subscribe(
            response => {
                this.loading = false;

                // prepare headquarters
                let headquarters = response.headquarters.map(head => new Headquarter(head));

                // prepare customers
                let customers = response.customers.map(cus => new Customer(cus));
                let visits = response.visits.map(visit => new Visit(visit));

                // prepare customer types
                let customer_types = response.customer_types.map(ct => new CustomerType(ct));
                this.customer_types = customer_types;

                // prepare data for table
                this.prepareData(headquarters, visits, customer_types, customers);
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
     * @param visits
     * @param customer_types
     */
    prepareData(headquarters: Headquarter[], visits: Visit[], customer_types: CustomerType[], customers: Customer[]) {

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
        visits.map(visit => {
            regions[visit.hq_region_id].area_objects[visit.hq_area_id].headquarters.map(hq => {
                if (hq.id == visit.hq_headquarter_id) {
                    hq.customer_types.map(ct => {
                        ct.grades.map(grade => {
                            if (grade.id == visit.grade_id)
                                grade.visit_count = visit.visit_count
                        });
                    })
                }
            })
        });

        // add counts to customer types
        customers.map(cus => {
            regions[cus.hq_region_id].area_objects[cus.hq_area_id].headquarters.map(hq => {
                if (hq.id == cus.hq_headquarter_id) {
                    hq.customer_types.map(ct => {
                        ct.grades.map(grade => {
                            if (grade.id == cus.grade_id)
                                grade.customer_count = cus.visit_count
                        });
                    })
                }
            })
        });

        // set
        this.regions = [];
        for (let i in regions) {
            let region = regions[i];
            for (let j in region.area_objects) {
                region.areas.push(region.area_objects[j]);
            }
            this.regions.push(region);
        }

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