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
import {Territory} from "../../../models/territory/territory";
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
    public bricks: Brick[] = [];


    /**
     * region, territory, area, headquarter & brick id
     */
    public region_id: number = 0;
    public area_id: number = 0;
    public headquarter_id: number = 0;
    public ab_stockist: number[] = [1, 2, 8, 9, 10, 11];

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
        this.region_id = 2;
        this.area_id = 3;
        this.headquarter_id = 4;
        this.fetch();
    }

    /**
     * load users for logged in user
     */
    fetch() {
        if (this.month && this.year) {
            this.reportService.brick_coverage(this.month + 1, this.year, this.headquarter_id).subscribe(
                response => {
                    this.bricks = [];
                    let bricks = response.bricks.map(brick => new Brick(brick));
                    let territories = response.territories.map(territory => new Territory(territory));
                    let visits = response.visits.map(visit => new Visit(visit));
                    let orders = response.orders.map(order => new Order(order));
                    let targets = response.targets.map(target => new Target(target));

                    territories.map(territory => {
                        territory.hq_bricks.map(brick => {
                            this.bricks.push(new Brick(brick));
                        });
                    });

                    this.bricks.map(brick => {

                        bricks.map(hq_brick => {

                            // Check customer type and set customer count
                            if (brick.id == hq_brick.id) {

                                if (hq_brick.customer_type_id == 1) {

                                    if (hq_brick.grade_id == 1 || hq_brick.grade_id == 2 || hq_brick.grade_id == 8 ||
                                        hq_brick.grade_id == 9 || hq_brick.grade_id == 10 || hq_brick.grade_id == 11) {
                                        hq_brick.customer_ab = hq_brick.customer_count;
                                    }
                                    else
                                        brick.customer_others = hq_brick.customer_count;

                                }
                                if (hq_brick.customer_type_id == 2) {
                                    brick.customer_semi = hq_brick.customer_count;
                                }
                                if (hq_brick.customer_type_id == 3) {
                                    brick.customer_retailer = hq_brick.customer_count;
                                }
                                if (hq_brick.customer_type_id == 4) {
                                    brick.customer_hub_chemist = hq_brick.customer_count;
                                }
                                if (hq_brick.customer_type_id == 5) {
                                    brick.customer_physician = hq_brick.customer_count;
                                }
                            }

                        });

                        visits.map(visit => {
                            if (visit.hq_brick_id == brick.id)
                                brick.visit_no_of_days = visit.no_of_days;

                        });

                        orders.map(order => {
                            if (order.hq_brick_id == brick.id)
                                brick.order_total_count = order.order_total_count;
                        });

                        targets.map(target => {

                            visits.map(visit => {
                                if (target.hq_headquarter_id == this.headquarter_id) {
                                    brick.target = ((target.total_target * 0.3) / 24) * visit.no_of_days;
                                }

                            });

                        });

                    });
                }
            );
        }
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
     * return value
     *
     * @param brick
     */
    returnPotential(brick){
        if(brick.customer_ab > 0 && brick.customer_semi > 0 && brick.customer_hub_chemist > 0)
            return 1;
        else if(brick.customer_semi > 0 && brick.customer_hub_chemist > 0 && brick.customer_others > 0)
            return 2;
        else if(brick.customer_ab == 0 && brick.customer_semi > 0 && brick.customer_hub_chemist > 0)
            return 3;
        else if(brick.customer_semi > 0 || brick.customer_hub_chemist > 0 )
            return 4;
        else if(brick.customer_retailer > 0)
            return 5;
    }

    returnBusiness(brick){
        if(brick.order_total_count > brick.target)
            return 1;
        else if(((brick.order_total_count/ brick.target) * 100) > 50)
            return 2;
        else if(((brick.order_total_count/ brick.target) * 100) < 50)
            return 3;

    }
}
