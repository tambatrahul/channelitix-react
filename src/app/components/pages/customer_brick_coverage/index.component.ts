import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Region} from "../../../models/territory/region";
import {ListComponent} from "../../base/list.component";
import {AuthService} from "../../../services/AuthService";
import * as moment from "moment";
import {ReportService} from "../../../services/report.service";
import {Brick} from "../../../models/territory/brick";
import {Visit} from "../../../models/visit/visit";
import {Order} from "../../../models/order/order";
import {Target} from "../../../models/SAP/target";
declare let jQuery: any;

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class CustomerBrickCoverageComponent extends ListComponent {

    /**
     * year and month for calendar
     * @type {number}
     */
    public month: number;
    public year: number;

    /**
     * regions
     *
     * @type {{}}
     */
    public regions: Region[] = [];

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
        this.reportService.brick_coverage(this.month + 1, this.year).subscribe(
            response => {

                let bricks = response.bricks.map(brick => new Brick(brick));
                let visits = response.visits.map(visit => new Visit(visit));
                let orders = response.orders.map(order => new Order(order));
                let targets = response.targets.map(target => new Target(target));

                bricks.map(brick => {

                    visits.map(visit => {

                        if (visit.hq_brick_id == brick.id) {

                        }
                    });

                    orders.map(order => {

                        if (order.hq_brick_id == brick.id) {

                        }
                    });

                    targets.map(target => {

                        if (target.hq_brick_id == brick.id) {

                        }
                    });

                });
            }
        );
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
     * set regions
     *
     * @param regions
     */
    setRegions(regions: Region[]) {
        this.regions = regions;
    }
}
