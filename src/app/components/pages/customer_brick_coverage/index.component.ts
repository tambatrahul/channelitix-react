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
   * region, territory, area, headquarter & brick id
   */
  public region_id: number = 0;
  public area_id: number = 0;
  public headquarter_id: number = 0;

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
    this.headquarter_id=4;
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
}
