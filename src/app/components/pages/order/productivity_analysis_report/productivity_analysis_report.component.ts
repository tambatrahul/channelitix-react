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
declare let jQuery: any;

@Component({
    templateUrl: 'productivity_analysis_report.component.html',
    styleUrls: ['productivity_analysis_report.component.less']
})
export class ProductivityAnalysisReportComponent extends ListComponent {

    excel_loaded: boolean = false;

    /**
     * dates
     *
     * @type {}
     */
    _dates: {
        from_date: '',
        to_date: '',
        year: ''
    };

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
     * on load of component load customer types
     */
    ngOnInit() {
        super.ngOnInit();
    }

    /**
     * On date change
     * @param dates
     */
    onDateChanged(dates) {
        this._dates = dates;
    }

    /**
     * load users for logged in user
     */
    fetch() {
        if (this._dates && this._dates.from_date && this._dates.to_date) {
            this.loading = true;
            this.reportService.productivity_analysis(this._dates.from_date, this._dates.to_date,
                this._dates.year).subscribe(
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

                    // prepare total_pob
                    let total_pob;

                    // prepare physician
                    let p_total_pob;
                    let p_calls
                    let p_productive_calls;

                    // prepare hub_chemist
                    let h_total_pob;
                    let h_calls
                    let h_productive_calls;

                    // prepare semi
                    let s_total_pob;
                    let s_calls
                    let s_productive_calls;

                    // prepare retailer
                    let r_total_pob;
                    let r_calls
                    let r_productive_calls;

                    // prepare total_call_avg
                    let total_call_avg;

                    // prepare product_call_avg
                    let product_call_avg;

                    //this.prepareData();
                },
                err => {
                    this.loading = false;
                }
            )
        }
    }

    /**
     * prepare data for headquarter wise customers
     *
     * @param headquarters
     * @param visits
     * @param customer_types
     * @param customers
     */
    prepareData(headquarters: Headquarter[], visits: Visit[], customer_types: CustomerType[],
                customers: Customer[], v2_v3_visits: Visit[]) {

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
                    });
                }
            });
        });

        v2_v3_visits.map(visit => {
            if (regions.hasOwnProperty(visit.hq_region_id)) {
                regions[visit.hq_region_id].area_objects[visit.hq_area_id].headquarters.map(hq => {
                    if (hq.id == visit.hq_headquarter_id) {
                        hq.customer_types[0].v2_count = visit.visited_twice;
                        hq.customer_types[0].v3_count = visit.visited_thrice;
                    }
                });
            }
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

        setTimeout(() => {
            if (!this.excel_loaded) {
                this.excel_loaded = true;
                jQuery(".visit_table").tableExport({
                    formats: ['xlsx'],
                    bootstrap: true,
                    position: "top"
                });
            }
        }, 1000);
    }
}
