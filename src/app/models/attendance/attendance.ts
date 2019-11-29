import {Model} from "../model";
import {WorkType} from "./work_type";
import {LeaveType} from "./leave_type";
import {User} from "../user/user";

export class Attendance extends Model {

  date: string;
  status: string;
  work_type_id: number;
  work_type: WorkType;
  leave_type_id: number;
  leave_type: LeaveType;
  created_by: number;
  creator: User;
  working_with_id: number;
  working_with_ids: Array<number> = [];
  working_with_other: boolean;
  working_withs: User[];
  no_of_calls: number = 0;
  pob_amount: number = 0;
  reporting_status: string = "open";

  // for internal use only
  isSunday: boolean = false;
  isHoliday: boolean = false;
  isPreviousClosed: boolean = false;
  isDisabled: boolean = false;
  day: number;
  att_day: number;
  att_month: number;
  att_count: number = 0;
  hq_headquarter_id: number = 0;
  attendance_count: number = 0;
  leave_count: number = 0;

  // Deviation Report
  visited_brick: string;
  stockist_met: number = 0;
  semi_met: number = 0;
  retailer_met: number = 0;
  hub_chemist_met: number = 0;
  healthcare_providers_met: number = 0;
  tour_plan: string;
  working_with_tour: string;
  working_with_visit: string;
  hq_area_id: number = 0;
  hq_region_id: number = 0;
  working_with_count: number = 0;
  working_with_id_tour: number;

  constructor(info: any) {
    super(info.id);
    this.date = info.date;
    this.status = info.status;
    if (info.work_type) {
      this.work_type = new WorkType(info.work_type);
    }

    this.leave_type = info.leave_type;
    this.created_by = info.created_by;
    this.creator = info.creator;
    this.day = info.day;
    this.work_type_id = info.work_type_id;
    this.leave_type_id = info.leave_type_id;
    this.working_with_id = info.working_with_id;
    this.reporting_status = info.reporting_status;
    this.att_day = info.att_day;
    this.att_month = info.att_month;
    this.working_with_other = info.working_with_other == 1;

    if (info.no_of_calls)
      this.no_of_calls = parseInt(info.no_of_calls);

    if (info.pob_amount)
      this.pob_amount = parseFloat(info.pob_amount);

    if (info.att_count)
      this.att_count = parseFloat(info.att_count);

    if (info.working_withs) {
      let self = this;
      this.working_withs = info.working_withs;
      info.working_withs.map(function (user) {
        self.working_with_ids.push(user.id);
      })
    } else {
      this.working_with_ids = [];
    }

    if (info.hq_headquarter_id)
      this.hq_headquarter_id = parseInt(info.hq_headquarter_id);

    if (info.attendance_count)
      this.attendance_count = parseInt(info.attendance_count);

    if (info.leave_count)
      this.leave_count = parseInt(info.leave_count);

    if (info.visited_brick)
      this.visited_brick = info.visited_brick;

    if (info.stockist_met)
      this.stockist_met = parseInt(info.stockist_met);

    if (info.semi_met)
      this.semi_met = parseInt(info.semi_met);

    if (info.hub_chemist_met)
      this.hub_chemist_met = parseInt(info.hub_chemist_met);

    if (info.retailer_met)
      this.retailer_met = parseInt(info.retailer_met);

    if (info.healthcare_providers_met)
      this.healthcare_providers_met = parseInt(info.healthcare_providers_met);

    if (info.tour_plan)
      this.tour_plan = info.tour_plan;

    if (info.working_with_tour)
      this.working_with_tour = info.working_with_tour;

    if (info.working_with_visit)
      this.working_with_visit = info.working_with_visit;

    if (info.hq_area_id)
      this.hq_area_id = parseInt(info.hq_area_id);

    if (info.hq_region_id)
      this.hq_region_id = parseInt(info.hq_region_id);

    if (info.working_with_count)
      this.working_with_count = parseInt(info.working_with_count);

    if (info.working_with_id_tour)
      this.working_with_id_tour = parseInt(info.working_with_id_tour);
  }

  /**
   * Attendance Count On 95% HQ
   *
   * @returns {boolean}
   */
  get greaterThan95PercentWithNorm25() {
    return this.att_count >= 23;
  }

  /**
   * Attendance Count On 95% HQ
   *
   * @returns {boolean}
   */
  get inBetween85To95PercentWithNorm25() {
    return this.att_count >= 21 && this.att_count <= 22;
  }

  /**
   * Attendance Count On 95% HQ
   *
   * @returns {boolean}
   */
  get lessThan85PercentWithNorm25() {
    return this.att_count <= 20;
  }

  /**
   * Attendance Count On 95% HQ
   *
   * @returns {boolean}
   */
  get greaterThan95PercentWithNorm22() {
    return this.att_count >= 21;
  }

  /**
   * Attendance Count On 95% HQ
   *
   * @returns {boolean}
   */
  get inBetween85To95PercentWithNorm22() {
    return this.att_count >= 19 && this.att_count < 21;
  }

  /**
   * Attendance Count On 95% HQ
   *
   * @returns {boolean}
   */
  get lessThan85PercentWithNorm22() {
    return this.att_count < 19;
  }

  /**
   * Attendance Working With Count On 95% HQ
   *
   * @returns {boolean}
   */
  get workingWithGreaterThan95PercentWithNorm4() {
    return this.working_with_count > 3;
  }

  /**
   * Attendance Working With Count On 95% HQ
   *
   * @returns {boolean}
   */
  get workingWithInBetween85To95PercentWithNorm4() {
    return this.working_with_count > 2 && this.working_with_count <= 3;
  }

  /**
   * Attendance Working With Count On 95% HQ
   *
   * @returns {boolean}
   */
  get workingWithLessThan85PercentWithNorm4() {
    return this.working_with_count <= 2;
  }

  /**
   * Attendance Count On 95% HQ
   *
   * @returns {boolean}
   */
  get greaterThan95PercentWithNorm20() {
    return this.att_count >= 19;
  }

  /**
   * Attendance Count On 95% HQ
   *
   * @returns {boolean}
   */
  get inBetween85To95PercentWithNorm20() {
    return this.att_count >= 17 && this.att_count < 19;
  }

  /**
   * Attendance Count On 95% HQ
   *
   * @returns {boolean}
   */
  get lessThan85PercentWithNorm20() {
    return this.att_count < 17;
  }

  /**
   * Attendance Working With Count On 95% HQ
   *
   * @returns {boolean}
   */
  get workingWithGreaterThan95PercentWithNorm12() {
    return this.working_with_count > 12;
  }

  /**
   * Attendance Working With Count On 95% HQ
   *
   * @returns {boolean}
   */
  get workingWithInBetween85To95PercentWithNorm12() {
    return this.working_with_count > 10 && this.working_with_count <= 12;
  }

  /**
   * Attendance Working With Count On 95% HQ
   *
   * @returns {boolean}
   */
  get workingWithLessThan85PercentWithNorm12() {
    return this.working_with_count <= 10;
  }
}
