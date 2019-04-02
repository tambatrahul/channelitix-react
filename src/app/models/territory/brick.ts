import {Model} from "../model";
import {CustomerType} from "../customer/customer_type";
import {Territory} from "./territory";
import {isNumber} from "util";
import {Customer} from "../customer/customer";

export class Brick extends Model {

  name: string;
  station: string;
  status: string;
  hq_territory_id: number;
  no_of_work_days: number;
  expected_business: number;
  distance_from_hq: number;
  hq_territory: Territory;
  customer_ab: number = 0;
  customer_others: number = 0;
  customer_retailer: number = 0;
  customer_hub_chemist: number = 0;
  customer_physician: number = 0;
  customer_semi: number = 0;

  v1_visit_count_retailer: number = 0;
  v1_visit_count_semi: number = 0;
  v1_visit_count_hub: number = 0;
  v1_visit_count_physician: number = 0;
  v1_pob: number = 0;
  v2_visit_count_retailer: number = 0;
  v2_visit_count_semi: number = 0;
  v2_visit_count_hub: number = 0;
  v2_visit_count_physician: number = 0;
  v2_vis_date: boolean = false;
  v2_ord_date: boolean = false;
  v2_pob: number = 0;
  cumulative_visit_count_retailer: number = 0;
  cumulative_visit_count_semi: number = 0;
  cumulative_visit_count_hub: number = 0;
  cumulative_visit_count_physician: number = 0;
  cumulative_pob: number = 0;
  vis_date: string;
  ord_date: string;

  customers: Customer [] = [];
  total_customer_others: number = 0;
  total_customer_retailer: number = 0;
  total_customer_hub_chemist: number = 0;
  total_customer_physician: number = 0;
  total_customer_semi: number = 0;

  customer_type_id: number;
  grade_id: number;
  customer_count: number = 0;
  visit_no_of_days: number = 0;
  order_total_count: number = 0;
  target: number = 0;
  months: Object = {};

  // for internal user only
  customer_types: CustomerType[];
  total_customer: number = 0;
  total_customers: number = 0;
  total: number = 0;
  norm: number = 0;
  hq_brick_id: number = 0;

  constructor(info: any) {
    super(info.id);
    this.name = info.name;
    this.station = info.station;
    this.status = info.status;
    this.no_of_work_days = info.no_of_work_days;
    this.expected_business = info.expected_business;
    this.distance_from_hq = info.distance_from_hq;
    this.customer_types = info.customer_types;
    this.total_customer = info.total_customer;
    this.total = info.total;
    this.hq_territory_id = info.hq_territory_id;
    this.target = info.target;

    if (info.customer_ab)
      this.customer_ab = parseInt(info.customer_ab);

    if (info.customer_others)
      this.customer_others = parseInt(info.customer_others);

    if (info.customer_hub_chemist)
      this.customer_hub_chemist = parseInt(info.customer_hub_chemist);

    if (info.customer_semi)
      this.customer_semi = parseInt(info.customer_semi);

    if (info.customer_retailer)
      this.customer_retailer = parseInt(info.customer_retailer);

    if (info.customer_physician)
      this.customer_physician = parseInt(info.customer_physician);

    if (info.total_customer_others)
      this.total_customer_others = parseInt(info.total_customer_others);

    if (info.total_customer_hub_chemist)
      this.total_customer_hub_chemist = parseInt(info.total_customer_hub_chemist);

    if (info.total_customer_semi)
      this.total_customer_semi = parseInt(info.total_customer_semi);

    if (info.total_customer_retailer)
      this.total_customer_retailer = parseInt(info.total_customer_retailer);

    if (info.total_customer_physician)
      this.total_customer_physician = parseInt(info.total_customer_physician);

    if (info.customer_count)
      this.customer_count = parseInt(info.customer_count);

    if (info.visit_no_of_days)
      this.visit_no_of_days = parseInt(info.visit_no_of_days);

    if (info.order_total_count)
      this.order_total_count = parseInt(info.order_total_count);

    if (info.target)
      this.target = parseInt(info.target);

    this.customer_type_id = info.customer_type_id;
    this.grade_id = info.grade_id;


    if (info.hq_territory)
      this.hq_territory = new Territory(info.hq_territory);

    if (info.vis_date)
      this.hq_territory = info.vis_date;

    if (info.total_customers)
      this.total_customers = parseInt(info.total_customers);

    if (info.hq_brick_id)
      this.hq_brick_id = info.hq_brick_id;
  }

  /**
   * get total number of customers
   *
   * @returns {number}
   */
  get total_customer_count() {
    let total: number = 0;
    this.customer_types.map(cus => {
      cus.grades.map(grade => {
        if (grade.customer_count)
          total += grade.customer_count;
      })
    });
    return total;
  }

  /**
   * return brick potential customer wise
   *
   * @returns {number}
   */
  get customer_count_pattern() {
    if (this.customer_ab > 0 && this.customer_semi > 0 && this.customer_hub_chemist > 0)
      return 1;
    else if (this.customer_semi > 0 && this.customer_hub_chemist > 0 && this.customer_others > 0)
      return 2;
    else if (this.customer_ab == 0 && this.customer_semi > 0 && this.customer_hub_chemist > 0)
      return 3;
    else if (this.customer_semi > 0 || this.customer_hub_chemist > 0)
      return 4;
    else if (this.customer_retailer > 0)
      return 5;
  }

  /**
   * Semi Count On 95% HQ
   *
   * @returns {boolean}
   */
  get semiGreaterThan95PercentWithNorm12() {
    return this.customer_type_id == 2 ? this.total_customers >= 11 : false;
  }

  /**
   * Semi Count On 95% HQ
   *
   * @returns {boolean}
   */
  get semiInBetween85To95PercentWithNorm12() {
    return this.customer_type_id == 2 ? this.total_customers >= 10 && this.total_customers < 11 : false;
  }

  /**
   * Semi Count On 95% HQ
   *
   * @returns {boolean}
   */
  get semiLessThan85PercentWithNorm12() {
    return this.customer_type_id == 2 ? this.total_customers < 10 : false;
  }

  /**
   * Attendance Count On 95% HQ
   *
   * @returns {boolean}
   */
  get hcpGreaterThan95PercentWithNorm10() {
    return this.customer_type_id == 5 ? this.total_customers > 9 : false;
  }

  /**
   * Attendance Count On 95% HQ
   *
   * @returns {boolean}
   */
  get hcpInBetween85To95PercentWithNorm10() {
    return this.customer_type_id == 5 ? this.total_customers >= 8 && this.total_customers <= 9 : false;
  }

  /**
   * Attendance Count On 95% HQ
   *
   * @returns {boolean}
   */
  get hcpLessThan85PercentWithNorm10() {
    return this.customer_type_id == 5 ? this.total_customers < 8 : false;
  }
}
