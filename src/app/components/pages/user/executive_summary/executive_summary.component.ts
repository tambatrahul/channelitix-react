import {Component} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {ReportService} from "../../../../services/report.service";
import {Region} from "../../../../models/territory/region";
import {Target} from "../../../../models/SAP/target";
import {PrimarySale} from "../../../../models/sale/primary_sale";
import {Order} from "../../../../models/order/order";
import {Attendance} from "../../../../models/attendance/attendance";
import {CustomerType} from "../../../../models/customer/customer_type";
import {Visit} from "../../../../models/visit/visit";
import * as moment from "moment";
import {Observable} from "rxjs/Rx";
import {Customer} from "../../../../models/customer/customer";

declare let jQuery: any;

@Component({
    templateUrl: 'executive_summary.component.html',
    styleUrls: ['executive_summary.component.less']
})
export class ExecutiveSummaryComponent extends ListComponent {

    /**
     * year and month for calendar
     * @type {number}
     */
    public month: number;
    public year: number;

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
            Observable.forkJoin(
                this.reportService.executive_summary(this.month + 1, this.year),
                this.reportService.hq_wise_visit_counts(this.month + 1, this.year)
            ).subscribe(data => {
                // get regions
                this.regions = data[0].regions.map(region => new Region(region));
                let customer_types = data[0].customer_types.map(ct => new CustomerType(ct));

                // get targets
                let targets = data[0].targets.map(target => new Target(target));
                this.mapTargets(targets, customer_types);

                let primaries = data[0].primary_sales.map(ps => new PrimarySale(ps));
                this.mapPrimary(primaries);

                let orders = data[0].orders.map(ord => new Order(ord));
                this.mapOrders(orders);

                let visits = data[0].visits.map(vis => new Visit(vis));
                let attendances = data[0].attendances.map(att => new Attendance(att));
                this.mapAttendances(attendances, visits);

                // prepare customers
                let customers = data[1].customers.map(cus => new Customer(cus));
                let visit_counts = data[1].visits.map(visit => new Visit(visit));

                // get v2 and v3 visits
                let v2_v3_visits = data[1].v2_v3_visits.map(visit => new Visit(visit));

                this.prepareData(visit_counts, customers, v2_v3_visits);
                this.loading = false;
            });

            this.reportService.executive_summary(this.month + 1, this.year).subscribe(
                response => {

                },
                err => {
                    this.loading = false;
                }
            );
        }
    }

    /**
     * prepare data for headquarter wise customers
     *
     * @param visits
     * @param customers
     * @param v2_v3_visits
     */
    prepareData(visits: Visit[], customers: Customer[], v2_v3_visits: Visit[]) {

        this.regions.map(region => {
            region.areas.map(area => {
                area.headquarters.map(headquarter => {
                    visits.map(vis => {
                        if (vis.hq_headquarter_id == headquarter.id)
                            headquarter.customer_types.map(ct => {
                                ct.grades.map(grade => {
                                    if (grade.id == vis.grade_id)
                                        grade.visit_count = vis.visit_count
                                });
                            })
                    });

                    customers.map(cus => {
                        if (cus.hq_headquarter_id == headquarter.id)
                            headquarter.customer_types.map(ct => {
                                ct.grades.map(grade => {
                                    if (grade.id == cus.grade_id)
                                        grade.customer_count = cus.visit_count
                                });
                            })
                    });

                    v2_v3_visits.map(visit => {
                        if (visit.hq_headquarter_id == headquarter.id) {
                            headquarter.customer_types[0].v2_count = visit.visited_twice;
                            headquarter.customer_types[0].v3_count = visit.visited_thrice;
                        }
                    });
                });
            });
        });
    }

    /**
     * map targets
     *
     * @param targets
     * @param customer_types
     */
    mapTargets(targets: Target[], customer_types: CustomerType[]) {
        this.regions.map(region => {
            region.areas.map(area => {
                area.headquarters.map(headquarter => {
                    targets.map(target => {
                        if (target.hq_headquarter_id == headquarter.id)
                            headquarter.target = target.total_target;
                    });
                    headquarter.customer_types = customer_types.map(ct => new CustomerType(ct));
                });
            });
        });
    }

    /**
     * map Primary
     *
     * @param primaries
     */
    mapPrimary(primaries: PrimarySale[]) {
        this.regions.map(region => {
            region.areas.map(area => {
                area.headquarters.map(headquarter => {
                    primaries.map(primary => {
                        if (primary.hq_headquarter_id == headquarter.id)
                            headquarter.primary = primary.total_net_amount;
                    })
                });
            });
        });
    }

    /**
     * map Orders
     *
     * @param orders
     */
    mapOrders(orders: Order[]) {
        this.regions.map(region => {
            region.areas.map(area => {
                area.headquarters.map(headquarter => {
                    orders.map(ord => {
                        if (ord.hq_headquarter_id == headquarter.id)
                            headquarter.total_pob += ord.order_total_count;
                    })
                });
            });
        });
    }

    /**
     * map Attendances
     *
     * @param attendances
     * @param visits
     */
    mapAttendances(attendances: Attendance[], visits: Visit[]) {
        this.regions.map(region => {
            region.areas.map(area => {
                area.headquarters.map(headquarter => {
                    attendances.map(att => {
                        if (att.hq_headquarter_id == headquarter.id) {
                            headquarter.total_pob += att.pob_amount;
                            headquarter.total_visit += att.no_of_calls;
                            headquarter.total_att += att.att_count;
                        }
                    });
                    visits.map(vis => {
                        if (vis.hq_headquarter_id == headquarter.id)
                            headquarter.total_visit += vis.visit_count;
                    });
                });
            });
        });
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
