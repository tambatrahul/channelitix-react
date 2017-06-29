import {Model} from "../model";
import {AppConstants} from "../../app.constants";
import {Tour} from "../tour_program/tour";
import {Headquarter} from "../territory/headquarter";
import {Visit} from "../visit/visit";
import * as moment from "moment";
import {Area} from "../territory/area";
import {Region} from "../territory/region";

export class User extends Model {

  full_name: string;
  mobile: string;
  username: string;
  password: string;
  joining_date: string;
  leaving_date: string;
  status: string;
  auth_token: string;
  role_id: number;
  role_str: string;
  manager_id: number;
  unread_count: number = 0;

  // territory changes
  hq_country_id: number;
  hq_region_id: number;
  hq_area_id: number;
  hq_headquarter_id: number;
  hq_territory_id: number;
  hq_brick_id: number;
  hq_headquarter: Headquarter;
  hq_area: Area;
  hq_region: Region;


  // manager
  manager: User;

  // for local use only
  attendances = [];
  visits: Visit[] = [];
  orders = [];
  tours: Tour[] = [];
  children: User[] = [];
  cse_count: number = 0;
  total_target: number = 0;
  mg_total_target: number = 0;
  zsm_total_target: number = 0;
  order_total_count: number = 0;
  order_total_quantity: number = 0;
  user_count: number = 0;

  constructor(info: any) {
    super(info.id);
    this.full_name = info.full_name;
    this.mobile = info.mobile;
    this.username = info.username;
    this.password = info.password;
    this.joining_date = info.joining_date;
    this.leaving_date = info.leaving_date;
    this.status = info.status;
    this.auth_token = info.auth_token;
    this.role_id = info.role_id;
    this.role_str = info.role_str;
    this.attendances = info.attendances;
    this.manager = info.manager;
    this.hq_region_id = info.hq_region_id;
    this.hq_area_id = info.hq_area_id;
    this.hq_headquarter_id = info.hq_headquarter_id;
    this.hq_territory_id = info.hq_territory_id;
    this.hq_brick_id = info.hq_brick_id;
    this.hq_country_id = info.hq_country_id;
    this.manager_id = info.manager_id;

    if (info.user_count)
      this.user_count = parseInt(info.user_count);

    if (info.hq_headquarter)
      this.hq_headquarter = new Headquarter(info.hq_headquarter);

    if (info.hq_area)
      this.hq_area = new Area(info.hq_area);

    if (info.hq_region)
      this.hq_region = new Region(info.hq_region);

    if (!info.attendances)
      this.attendances = [];

    if (info.total_target)
      this.total_target = parseFloat(info.total_target);

    if (info.mg_total_target)
      this.mg_total_target = parseFloat(info.mg_total_target);
  }

  get daily_target(): number {
    if (this.environment.envName == 'sk_group')
      return this.total_target > 0 ? parseFloat(((this.total_target / 1000) / 24).toFixed(1)) : 0;
    return this.total_target > 0 ? parseFloat((((this.total_target / 1000) * 0.30) / 24).toFixed(1)) : 0;
  }

  get daily_target_40(): number {
    return this.total_target > 0 ? parseFloat((((this.total_target / 1000) * 0.40) / 24).toFixed(1)) : 0;
  }

  get mg_daily_target(): number {
    if (this.environment.envName == 'sk_group')
      return this.mg_total_target > 0 ? parseFloat(((this.mg_total_target / 1000) / 24).toFixed(1)) : 0;
    return this.mg_total_target > 0 ? parseFloat((((this.mg_total_target / 1000) * 0.30) / 24).toFixed(1)) : 0;
  }

  get mg_daily_target_40(): number {
    return this.mg_total_target > 0 ? parseFloat((((this.mg_total_target / 1000) * 0.40) / 24).toFixed(1)) : 0;
  }

  get zsm_daily_target(): number {
    if (this.environment.envName == 'sk_group')
      return this.zsm_total_target > 0 ? parseFloat(((this.zsm_total_target / 1000) / 24).toFixed(1)) : 0;
    return this.zsm_total_target > 0 ? parseFloat((((this.zsm_total_target / 1000) * 0.30) / 24).toFixed(1)) : 0;
  }

  get zsm_daily_target_40(): number {
    return this.zsm_total_target > 0 ? parseFloat((((this.zsm_total_target / 1000) * 0.40) / 24).toFixed(1)) : 0;
  }

  /**
   * if role is less then 3
   * @returns {boolean}
   */
  get isLastChild(): boolean {
    return this.role_str == AppConstants.ROLE_CSE;
  }

  /**
   * working field days count
   *
   * @returns {number}
   */
  get field_work_count(): number {
    return this.attendances.filter(function (att, index) {
      if (att.work_type)
        return att.work_type.name == AppConstants.FIELD_WORK;
      return false;
    }).length;
  }

  /**
   * meeting days count
   *
   * @returns {number}
   */
  get meeting_count(): number {
    return this.attendances.filter(function (att, index) {
      if (att.work_type)
        return att.work_type.name == AppConstants.MEETING;
      return false;
    }).length;
  }

  /**
   * leave days count
   *
   * @returns {number}
   */
  get leave_count(): number {
    return this.attendances.filter(function (att, index) {
      return att.status == AppConstants.LEAVE;
    }).length;
  }

  /**
   * holiday days count
   *
   * @returns {number}
   */
  get holiday_count(): number {
    return this.attendances.filter(function (att, index) {
      return att.status == AppConstants.HOLIDAY;
    }).length;
  }

  /**
   * Check For Admin
   *
   * @returns {boolean}
   */
  get isAdmin(): boolean {
    return this.role_str == AppConstants.ROLE_ADMIN;
  }

  /**
   * Check For Region
   *
   * @returns {boolean}
   */
  get isRegion(): boolean {
    return this.role_str == AppConstants.ROLE_ZSM;
  }

  /**
   * Check For Area
   *
   * @returns {boolean}
   */
  get isArea(): boolean {
    return this.role_str == AppConstants.ROLE_CSM;
  }

  /**
   * Check For Headquarter
   *
   * @returns {boolean}
   */
  get isHeadquarter(): boolean {
    return this.role_str == AppConstants.ROLE_CSE;
  }

  /**
   * get total visits count
   *
   * @returns {any}
   */
  get total_visit_count() {
    let total: number = 0;
    this.visits.map(vis => {
      if (vis.visit_count > 0)
        total += vis.visit_count;
    });
    return total;
  }

  /**
   * get total pob count
   *
   * @returns {any}
   */
  get total_pob_count() {
    let total: number = 0;
    this.orders.map(vis => {
      total += vis.order_total_count;
    });
    return total;
  }

  /**
   * get total pob quantity count
   *
   * @returns {any}
   */
  get total_pob_quantity_count() {
    let total: number = 0;
    this.orders.map(vis => {
      total += parseFloat(String(vis.order_total_quantity));
    });
    return total;
  }

  /**
   * manager get total pob count
   *
   * @returns {any}
   */
  get mg_total_pob_count() {
    let total: number = 0;
    this.orders.map(vis => {
      total += vis.mg_order_total_count;
    });
    return total;
  }

  /**
   * manager get total pob quantity count
   *
   * @returns {any}
   */
  get mg_total_pob_quantity_count() {
    let total: number = 0;
    this.orders.map(vis => {
      total += parseFloat(String(vis.mg_order_total_quantity));
    });
    return total;
  }

  /**
   * manager get total pob count
   *
   * @returns {any}
   */
  get zsm_total_pob_count() {
    let total: number = 0;
    this.orders.map(vis => {
      total += vis.zsm_order_total_count;
    });
    return total;
  }

  /**
   * zsm get total pob quantity count
   *
   * @returns {any}
   */
  get zsm_total_pob_quantity_count() {
    let total: number = 0;
    this.orders.map(vis => {
      total += parseFloat(String(vis.zsm_order_total_quantity));
    });
    return total;
  }

  /**
   * percentage pob
   * @returns {string|number}
   */
  get percent_pob() {
    let day = moment().date();
    day = day - parseInt((day / 7).toFixed(0));
    return this.daily_target > 0 ? (((this.total_pob_count / 1000) / (this.daily_target * day)) * 100).toFixed(0) : 0
  }

  /**
   * percentage pob 40%
   * @returns {string|number}
   */
  get percent_pob_40() {
    let day = moment().date();
    day = day - parseInt((day / 7).toFixed(0));
    return this.daily_target_40 > 0 ? (((this.total_pob_count / 1000) / (this.daily_target_40 * day)) * 100).toFixed(0) : 0
  }

  /**
   * percentage pob
   * @returns {string|number}
   */
  get mg_percent_pob() {
    let day = moment().date();
    day = day - parseInt((day / 7).toFixed(0));
    return this.mg_daily_target > 0 ? (((this.mg_total_pob_count / 1000) / (this.mg_daily_target * day)) * 100).toFixed(0) : 0
  }

  /**
   * percentage pob 40%
   * @returns {string|number}
   */
  get mg_percent_pob_40() {
    let day = moment().date();
    day = day - parseInt((day / 7).toFixed(0));
    return this.mg_daily_target_40 > 0 ? (((this.mg_total_pob_count / 1000) / (this.mg_daily_target_40 * day)) * 100).toFixed(0) : 0
  }

  /**
   * percentage pob
   * @returns {string|number}
   */
  get zsm_percent_pob() {
    let day = moment().date();
    day = day - parseInt((day / 7).toFixed(0));
    return this.zsm_daily_target > 0 ? (((this.zsm_total_pob_count / 1000) / (this.zsm_daily_target * day)) * 100).toFixed(0) : 0
  }

  /**
   * percentage pob 40%
   * @returns {string|number}
   */
  get zsm_percent_pob_40() {
    let day = moment().date();
    day = day - parseInt((day / 7).toFixed(0));
    return this.zsm_daily_target_40 > 0 ? (((this.zsm_total_pob_count / 1000) / (this.zsm_daily_target_40 * day)) * 100).toFixed(0) : 0
  }
}
