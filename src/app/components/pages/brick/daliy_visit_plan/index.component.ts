import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ListComponent} from "../../../base/list.component";
import {Area} from "../../../../models/territory/area";
import {Headquarter} from "../../../../models/territory/headquarter";
import {AuthService} from "../../../../services/AuthService";
import {ReportService} from "../../../../services/report.service";
import * as moment from "moment";
import {Tour} from "../../../../models/tour_program/tour";
import {Order} from "../../../../models/order/order";
import {Customer} from "../../../../models/customer/customer";

declare let jQuery: any;

@Component({
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.less']
})
export class DailyVisitPlanComponent extends ListComponent {

  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public year: number;

  /**
   * user joining date
   */
  public day: number;
  /**
   * region, territory, area, headquarter & brick id
   */
  public start_day: number = 0;
  public end_day: number = 0;
  public region_id: number = 0;
  public area_id: number = 0;
  public headquarter_id: number = 0;
  public _headquarters: Headquarter[] = [];
  public _areas: Area[] = [];
  btn_loading: boolean = false;
  tours: Tour[] = [];
  public bricks = [];
  public dates = [];

  /**
   * User Component Constructor
   */
  constructor(public _service: AuthService, public route: ActivatedRoute, public reportService: ReportService) {
    super(_service);
  }


  /**
   * get title of table
   * @returns {string}
   */
  get title(): string {
    return this.day + " " + moment().year(this.year).month(this.month).format("MMMM, YYYY");
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    this.month = moment().month();
    this.year = moment().year();
    this.setDates();
    this.day = this.start_day;
    this.fetch();
    super.ngOnInit();
  }

  /**
   * Set Dates
   */
  setDates() {
    // get date
    let date = moment().year(this.year).month(this.month);

    // get start date and end date of month
    this.start_day = date.startOf('month').date();
    this.end_day = date.endOf('month').date();
    for (let date: number = this.start_day; date <= this.end_day; date++) {
      this.dates.push(date);
    }
  }

  /**
   * load users for logged in user
   */
  fetch() {
    let date = moment([this.year, this.month, this.day]).format('YYYY-MM-DD');
    if (this.headquarter_id > 0) {
      this.loading = true;
      this.reportService.daily_visit_plan(date, this.headquarter_id).subscribe(
        response => {
          // Set Tour
          this.tours = response.tours.map(tour => new Tour(tour));

          let orders = response.orders.map(order => new Order(order));
          let customers = response.customers.map(customer => new Customer(customer));

          this.prepareData(orders, customers);
          this.loading = false;
        });
    }
  }

  /**
   * Prepare Data To Display
   *
   * @param {Order[]} orders
   * @param {Customer[]} customers
   */
  prepareData(orders: Order[], customers: Customer[]) {
    let bricks = {};
    this.tours.map(tour => {
      bricks[tour.hq_brick_id] = {
        'id': tour.hq_brick_id,
        'name': tour.hq_brick.name,
        'customers': []
      };
    });

    // Customer List Prepare
    customers.map(customer => {
      bricks[customer.hq_brick_id].customers.push(new Customer(customer));
    });

    // Order List Prepare
    orders.map(order => {
      for (let cus of bricks[order.hq_brick_id].customers) {
        if (cus.id == order.customer_id)
          cus.total_pob = order.order_total_count;
      }
    });

    this.bricks = this.generateArray(bricks);
    console.log(this.bricks);
  }

  // Generate Object To Array
  generateArray(obj) {
    return Object.keys(obj).map((key) => {
      return obj[key];
    });
  }

  /**
   * get headquarters
   */
  headquarters(data) {
    this._headquarters = data.headquarters;
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
    this.fetch();
  }

  /**
   * on  day changed
   */
  dayChanged(day) {
    this.day = day;
    this.fetch();
  }

  /**
   * month and year changed
   *
   * @param date
   */
  monthYearChanged(date) {
    this.month = date.month;
    this.year = date.year;
    this.dates = [];
    this.setDates();
    this.fetch();
  }
}
