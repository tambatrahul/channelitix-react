import {Model} from "../model";
import {User} from "../user/user";
import {VisitInput} from "./visit_input";
import {Customer} from "../customer/customer";
import {InputAnswer} from "./input_answer";
import {Attendance} from "../attendance/attendance";
import {CustomerPriorities} from './customer_priorities';
import {UserInput} from '../V2/user/user_input';

export class Visit extends Model {

  visit_date: string;
  comments: string;
  latitude: string;
  longitude: string;
  customer_id: number;
  visit_input_count: number;
  input_id: number;
  created_by: number;
  no_of_days: number;
  stockist_code: number;
  creator: User;
  inputs: VisitInput[];
  customer_priorities: CustomerPriorities[] = [];
  priorities: CustomerPriorities[] = [];
  name: string;
  input_answers: InputAnswer[];
  customer: Customer;

  // for internal use only
  isSunday: boolean = false;
  visit_count: number = 0;
  all_visit_count: number = 0;
  visit_total_count: number = 0;
  total_visit_count: number = 0;
  visit_count_total: number = 0;
  visit_day: number = 0;
  visit_month: number;
  attendance: Attendance = new Attendance({});
  hq_headquarter_id: number;
  hq_brick_id: number;
  hq_area_id: number;
  hq_region_id: number;
  grade_id: number;
  doctor_speciality: string;
  doctorGroupName: string;
  visited_twice: number = 0;
  visited_thrice: number = 0;
  customer_type_id: number = 0;
  customer_count: number;
  days: string;

  visited_brick: string;
  visited_hq: number = 0;

  constructor(info: any) {
    super(info.id);
    this.visit_date = info.visit_date;
    this.comments = info.comments;
    this.latitude = info.latitude;
    this.longitude = info.longitude;
    this.customer_id = info.customer_id;

    if (info.created_by)
      this.created_by = parseInt(info.created_by);

    if (info.creator)
      this.creator = new User(info.creator);

    this.isSunday = info.isSunday;
    this.hq_area_id = info.hq_area_id;
    this.hq_region_id = info.hq_region_id;
    this.grade_id = info.grade_id;
    this.doctor_speciality = info.doctor_speciality;
    this.doctorGroupName = info.doctorGroupName;
    this.stockist_code = info.stockist_code;

    if (info.days)
      this.days = info.days;

    if (info.hq_headquarter_id)
      this.hq_headquarter_id = parseInt(info.hq_headquarter_id);

    // set customer
    if (info.customer)
      this.customer = new Customer(info.customer);

    // inputs
    if (info.inputs)
      this.inputs = info.inputs.map(function (input) {
        return new VisitInput(input);
      });

    // customer priorities
    if (info.customer_priorities)
      this.customer_priorities = info.customer_priorities.map(function (priority) {
        return new CustomerPriorities(priority);
      });
    // input answers
    if (info.input_answers)
      this.input_answers = info.input_answers.map(function (input) {
        return new InputAnswer(input);
      });

    // customer priorities
    if (info.priorities)
      this.priorities = info.priorities.map(function (priority) {
        return new CustomerPriorities(priority);
      });
    // internal
    if (info.visit_count)
      this.visit_count = parseInt(info.visit_count);
    else
      this.visit_count = 0;

    if (info.all_visit_count)
      this.all_visit_count = parseInt(info.all_visit_count);
    else
      this.all_visit_count = 0;

    if (info.visit_day)
      this.visit_day = parseInt(info.visit_day);
    this.visit_month = info.visit_month;

    if (info.visited_twice)
      this.visited_twice = parseInt(info.visited_twice);

    if (info.visited_thrice)
      this.visited_thrice = parseInt(info.visited_thrice);

    if (info.customer_type_id)
      this.customer_type_id = parseInt(info.customer_type_id);

    if (info.customer_count)
      this.customer_count = parseInt(info.customer_count);

    this.hq_brick_id = info.hq_brick_id;
    this.no_of_days = info.no_of_days;

    if (info.visited_brick)
      this.visited_brick = info.visited_brick;

    if (info.input_id)
      this.input_id = info.input_id;

    if (info.visit_input_count)
      this.visit_input_count = info.visit_input_count;

    if (info.visited_hq)
      this.visited_hq = info.visited_hq;

  }

  /**
   * get input totals
   *
   * @returns {number}
   */
  get total_inputs() {
    let total: number = 0;
    this.inputs.map(function (input) {
      total += input.value;
    });
    return total;
  }

  /**
   * Visited Twice Count
   *
   * @returns {boolean}
   */
  get visitedTwiceWithNorm25HavingGreaterThan95Percentage() {
    return this.visited_twice >= 9;
  }

  /**
   * Visited Twice Count
   *
   * @returns {boolean}
   */
  get visitedTwiceWithNorm25Between85To95Percentage() {
    return this.visited_twice >= 8 && this.visited_twice < 9;
  }

  /**
   * Visited Twice Count
   *
   * @returns {boolean}
   */
  get visitedTwiceWithNorm25HavingLessThan85Percentage() {
    return this.visited_twice < 8;
  }

  /**
   * Worked With Greater Than 95% With Norm 4
   */
  get workedWithAreaHQGreaterThan95PercentageWith4() {
    return this.visited_hq > 3 ;
  }

  /**
   * Worked With Greater Than 95% With Norm 4
   */
  get workedWithAreaHQBetween85To95PercentageWith4() {
    return this.visited_hq > 2 && this.visited_hq <= 3;
  }

  /**
   * Worked With Less Than 85% With Norm 4
   */
  get workedWithAreaHQLessThan85PercentageWith4() {
    return this.visited_hq <= 2;
  }

  /**
   * Worked With Greater Than 95% With Norm 8
   */
  get workedWithRegionHQGreaterThan95PercentageWith8() {
    return this.visited_hq > 7 ;
  }

  /**
   * Worked With Greater Than 95% With Norm 8
   */
  get workedWithRegionHQBetween85To95PercentageWith8() {
    return this.visited_hq > 6 && this.visited_hq <= 7;
  }

  /**
   * Worked With Less Than 85% With Norm 8
   */
  get workedWithRegionHQLessThan85PercentageWith8() {
    return this.visited_hq <= 6;
  }
}
