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
import {Region} from "../../../../models/territory/region";
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
     * get regions
     *
     * @type {Array}
     */
    regions: Region[] = [];

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
            this.reportService.productivity_analysis(this._dates.from_date, this._dates.to_date).subscribe(
                data => {
                    // get regions
                    this.regions = data[0].regions.map(region => new Region(region));
                    this.customer_types = data[0].customer_types.map(ct => new CustomerType(ct));

                    // prepare customers
                    let customers = data[1].customers.map(cus => new Customer(cus));

                    // prepare visits
                    let visits = data[0].visits.map(vis => new Visit(vis));

                    // prepare orders
                    let orders = data[0].orders.map(ord => new Order(ord));

                    // prepare attendances
                    let attendances = data[0].attendances.map(att => new Attendance(att));

                    this.prepareData(customers, attendances, visits, orders);

                    this.loading = false;
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
    prepareData(customers: Customer[], attendances: Attendance[], visits: Visit[],orders: Order[]) {

        this.regions.map(region => {
            region.areas.map(area => {
                area.headquarters.map(headquarter => {
                    attendances.map(att => {
                        if (att.hq_headquarter_id == headquarter.id) {
                            headquarter.customer_types.map(ct => {
                                if (ct.hq_headquarter_id == att.hq_headquarter_id)
                                    ct.attendance_count = att.attendance_count
                            });
                            area.customer_types.map(ct => {
                                if (ct.hq_headquarter_id == att.hq_headquarter_id)
                                    ct.attendance_count += att.attendance_count
                            });
                            region.customer_types.map(ct => {
                                if (ct.hq_headquarter_id == att.hq_headquarter_id)
                                    ct.attendance_count += att.attendance_count
                            });
                        }
                    });

                    customers.map(cus => {
                        if (cus.hq_headquarter_id == headquarter.id) {
                            headquarter.customer_types.map(ct => {
                                if (ct.hq_headquarter_id == cus.hq_headquarter_id)
                                    ct.visit_count = cus.visit_count
                            });
                            area.customer_types.map(ct => {
                                if (ct.hq_headquarter_id == cus.hq_headquarter_id)
                                    ct.visit_count += cus.visit_count
                            });
                            region.customer_types.map(ct => {
                                if (ct.hq_headquarter_id == cus.hq_headquarter_id)
                                    ct.visit_count += cus.visit_count
                            });
                        }
                    });

                    visits.map(vis => {
                        if (vis.hq_headquarter_id == headquarter.id) {
                            headquarter.customer_types.map(ct => {
                                if (ct.hq_headquarter_id == vis.hq_headquarter_id)
                                    ct.visit_count = vis.visit_count
                            });
                            area.customer_types.map(ct => {
                                if (ct.hq_headquarter_id == vis.hq_headquarter_id)
                                    ct.visit_count += vis.visit_count
                            });
                            region.customer_types.map(ct => {
                                if (ct.hq_headquarter_id == vis.hq_headquarter_id)
                                    ct.visit_count += vis.visit_count
                            });
                        }
                    });

                    orders.map(ord => {
                        if (ord.hq_headquarter_id == headquarter.id) {
                            headquarter.customer_types.map(ct => {
                                if (ct.hq_headquarter_id == ord.hq_headquarter_id)
                                    ct.order_count = ord.order_count
                            });
                            area.customer_types.map(ct => {
                                if (ct.hq_headquarter_id == ord.hq_headquarter_id)
                                    ct.order_count += ord.order_count
                            });
                            region.customer_types.map(ct => {
                                if (ct.hq_headquarter_id == ord.hq_headquarter_id)
                                    ct.order_count += ord.order_count
                            });
                        }
                    });

                });
            });
        });

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
