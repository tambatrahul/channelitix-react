import {Component, Input} from "@angular/core";
import {ReportService} from "../../../../../../services/report.service";
import {AuthService} from "../../../../../../services/AuthService";
import {Region} from "../../../../../../models/territory/region";
import {ListComponent} from "../../../../../base/list.component";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {Order} from "../../../../../../models/order/order";
import {Attendance} from "../../../../../../models/attendance/attendance";
import {Visit} from "../../../../../../models/visit/visit";
import {Target} from "../../../../../../models/SAP/target";

@Component({
    selector: '[ff-effort-metrics]',
    styleUrls: ['ff_effort_metrics.component.less'],
    templateUrl: 'ff_effort_metrics.component.html'
})
export class FFEffortMetricsComponent extends ListComponent {

    public _regions: Region[];
    @Input()
    set regions(regions) {
        this._regions = regions;
        this.fetch();
    }


    /**
     * month of sales
     */
    public _month: number;
    @Input()
    set month(month: number) {
        this._month = month;
    }

    /**
     * year of sale
     */
    public _year: number;
    @Input()
    set year(year: number) {
        this._year = year;
    }


    show_data: boolean = false;

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
     * Chart data
     */
    fetch() {
        Observable.forkJoin(
            this.reportService.pob(this._month, this._year),
            this.reportService.ff_effort_metrics(this._month, this._year)
        ).subscribe(data => {

            // get targets monthly
            let targets = data[0].targets.map(target => new Target(target));
            let orders = data[0].orders.map(order => new Order(order));
            let visits = data[0].visits.map(visit => new Visit(visit));
            let attendances = data[0].attendances.map(att => new Attendance(att));

            this.prepareData(targets, orders);
        });
    }

    /**
     * Prepare data for primary sales
     * @param targets
     * @param orders
     */
    prepareData(targets: Target[], orders: Order[]) {
        this._regions.map(region => {
            region.areas.map(area => {
                area.headquarters.map(headquarter => {
                    orders.map(ord => {
                        if (ord.hq_headquarter_id == headquarter.id) {
                            headquarter.total_pob += ord.order_total_count;
                            region.total_pob += ord.order_total_count;
                        }
                    })

                });
            });

        });
    };
}
