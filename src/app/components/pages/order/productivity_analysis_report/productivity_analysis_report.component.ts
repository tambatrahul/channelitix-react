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
import {Order} from "../../../../models/order/order";
import {Attendance} from "../../../../models/attendance/attendance";
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

                    // prepare visits
                    let visits = response.visits.map(visit => new Visit(visit));

                    // prepare orders
                    let orders = response.orders.map(order => new Order(order));

                    // prepare attendances
                    let attendances = response.orders.map(attendance => new Attendance(attendance));

                    // prepare customer types
                    let customer_types = response.customer_types.map(ct => new CustomerType(ct));
                    this.customer_types = customer_types;

                    this.prepareData(headquarters, customer_types, customers, attendances, visits, orders);
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
     * @param customer_types
     * @param customers
     * @param attendances
     * @param visits
     * @param orders
     */
    prepareData(headquarters: Headquarter[], customer_types: CustomerType[], customers: Customer[],
                attendances: Attendance[], visits: Visit[],orders: Order[]) {

        // prepare headquarters
        let regions = {};
        headquarters.map(hq => {
            if (!regions.hasOwnProperty(hq.hq_area.hq_region.id))
                regions[hq.hq_area.hq_region.id] = hq.hq_area.hq_region;

            if (!regions[hq.hq_area.hq_region.id].area_objects.hasOwnProperty(hq.hq_area.id))
                regions[hq.hq_area.hq_region.id].area_objects[hq.hq_area.id] = hq.hq_area;

            // add customer type
            hq.customer_types = customer_types.map(ct => new CustomerType(ct));
            regions[hq.id].headquarters.push(hq);
        });

        // add counts to customer types
        visits.map(visit => {
            regions[visit.hq_region_id].area_objects[visit.hq_area_id].headquarters.map(hq => {
                if (hq.id == visit.hq_headquarter_id) {
                    hq.customer_types.map(ct => {

                    })
                }
            })
        });

        // add counts to customer types
        customers.map(cus => {
            regions[cus.hq_region_id].area_objects[cus.hq_area_id].headquarters.map(hq => {
                if (hq.id == cus.hq_headquarter_id) {
                    hq.customer_types.map(ct => {

                    });
                }
            });
        });

        // add counts to
        attendances.map(att => {
            regions[att.hq_headquarter_id].area_objects[att.hq_headquarter_id].headquarters.map(hq => {
                if (hq.id == att.hq_headquarter_id) {
                    hq.customer_types.map(ct => {

                    });
                }
            });
        });

        // add counts to order pob
        orders.map(ord => {
            regions[ord.hq_headquarter_id].area_objects[ord.hq_headquarter_id].headquarters.map(hq => {
                if (hq.id == ord.hq_headquarter_id) {
                    hq.customer_types.map(ct => {

                    });
                }
            });
        });

        // set
        this.regions = [];
        for (let i in regions) {
            let region = regions[i];
            for (let j in region.customer_types) {
                region.customer_types.push(region.customer_type_objects[j]);
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
