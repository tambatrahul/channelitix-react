import {Model} from "../model";
import {CustomerType} from "../customer/customer_type";
import {Region} from "./region";
import {Headquarter} from "./headquarter";
import {User} from "../user/user";
import {InputAnswer} from "../visit/input_answer";

export class Area extends Model {

  name: string;
  status: string;
  hq_region: Region;

  // for internal user only
  customer_types: CustomerType[];
  headquarters: Headquarter[] = [];
  total: number = 0;
  total_bricks: number = 0;
  target: number = 0;
  quantity: number = 0;
  skinlite_target: number = 0;
  gelusil_target: number = 0;
  encube_target:number = 0;
  accuchek_target: number = 0;
  accufine_target: number = 0;
  becosules_target: number = 0;
  primary: number = 0;
  skinlite_primary: number = 0;
  gelusil_primary: number = 0;
  encube_primary: number = 0;
  accuchek_primary: number = 0;
  accufine_primary: number = 0;
  becosules_primary: number = 0;
  total_pob: number = 0;
  skinlite_total_pob: number = 0;
  gelusil_total_pob: number = 0;
  encube_total_pob: number = 0;
  accuchek_total_pob: number = 0;
  accufine_total_pob: number = 0;
  becosules_total_pob: number = 0;
  total_visit: number = 0;
  all_total_visit: number = 0;
  total_att: number = 0;
  total_customers: number = 0;
  fw_days: number = 0;

  customer_count: number = 0;
  territories_count: number = 0;
  headquarters_count: number = 0;
  bricks_count: number = 0;
  total_order: number = 0;
  hq_region_id: number = 0;

  ar_last_year_total: number = 0;
  ar_last_year_dexona_total: number = 0;
  ar_last_month_total: number = 0;
  ar_last_month_dexona_total: number = 0;

  area_total_visits: number = 0;
  area_total_orders: number = 0;
  area_total_orders_amount: number = 0;
  area_total_customers: number = 0;
  area_total_customers_ordered: number = 0;
  area_total_target: number = 0;

  unit_price: number = 0;
  opening: number = 0;
  opening_value: number = 0;
  adjustment: number = 0;
  secondary_sale: number = 0;
  secondary_amount: number = 0;
  closing: number = 0;
  closing_value: number = 0;
  total_net_amount: number = 0;
  total_net_quantity: number = 0;
  inputs: InputAnswer[] = [];
  total_input_value: number = 0;
  user: User;

  semi_total_visit_count: number = 0;
  retailer_total_visit_count: number = 0;
  hcp_total_visit_count: number = 0;

  vacant_hq_count:number = 0;
  semi_total_count: number = 0;
  retailer_total_count: number = 0;
  hcp_total_count: number = 0;
  norm: number = 0;

  constructor(info: any) {
    super(info.id);
    this.name = info.name;
    this.status = info.status;
    this.customer_types = info.customer_types;
    this.total = info.total;
    if (info.hq_region)
      this.hq_region = new Region(info.hq_region);

    if (info.territories_count)
      this.territories_count = info.territories_count.aggregate;

    if (info.headquarters_count)
      this.headquarters_count = info.headquarters_count.aggregate;

    if (info.bricks_count)
      this.bricks_count = info.bricks_count.aggregate;

    if (info.headquarters)
      this.headquarters = info.headquarters.map(area => new Headquarter(area));

    if (info.total_order)
      this.total_order = parseInt(info.total_order);

    if (info.hq_region_id)
      this.hq_region_id = parseInt(info.hq_region_id);

    if (info.total_visit)
      this.total_visit = parseInt(info.total_visit);

    if (info.total_customers)
      this.total_customers = parseInt(info.total_customers);

    if (info.total_net_amount)
      this.total_net_amount = parseFloat(info.total_net_amount);

    if (info.total_net_quantity)
      this.total_net_quantity = parseFloat(info.total_net_quantity);

    if (info.ar_last_year_total)
      this.ar_last_year_total = parseInt(info.ar_last_year_total);

    if (info.ar_last_year_dexona_total)
      this.ar_last_year_dexona_total = parseInt(info.ar_last_year_dexona_total);

    if (info.ar_last_month_total)
      this.ar_last_month_total = parseInt(info.ar_last_month_total);

    if (info.ar_last_month_dexona_total)
      this.ar_last_month_dexona_total = parseInt(info.ar_last_month_dexona_total);

    if (info.area_total_visits)
      this.area_total_visits = parseInt(info.area_total_visits);

    if (info.area_total_orders)
      this.area_total_orders = parseInt(info.area_total_orders);

    if (info.area_total_orders_amount)
      this.area_total_orders_amount = parseInt(info.area_total_orders_amount);

    if (info.area_total_customers)
      this.area_total_customers = parseInt(info.area_total_customers);

    if (info.area_total_customers_ordered)
      this.area_total_customers_ordered = parseInt(info.area_total_customers_ordered);

    if (info.area_total_target)
      this.area_total_target = parseInt(info.area_total_target);

    if (info.unit_price)
      this.unit_price = parseFloat(info.unit_price);

    if (info.opening)
      this.opening = parseFloat(info.opening);

    if (info.opening_value)
      this.opening_value = parseFloat(info.opening_value);

    if (info.adjustment)
      this.adjustment = parseFloat(info.adjustment);

    if (info.secondary_sale)
      this.secondary_sale = parseFloat(info.secondary_sale);

    if (info.closing)
      this.closing = parseFloat(info.closing);

    if (info.closing_value)
      this.closing_value = parseFloat(info.closing_value);

    if (info.secondary_amount)
      this.secondary_amount = parseFloat(info.secondary_amount);

    if (info.total_input_value)
      this.total_input_value = parseInt(info.total_input_value);

    if (info.vacant_hq_count)
      this.vacant_hq_count = info.vacant_hq_count;
  }

  /**
   * get total number of customers
   *
   * @returns {number}
   */
  get total_customer() {
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
   * get area target
   *
   * @returns {number}
   */
  get area_target() {
    return this.headquarters.reduce((a, b) => {
      return a + b.target;
    }, 0)
  }

  /**
   * get area target
   *
   * @returns {number}
   */
  get area_primary() {
    return this.headquarters.reduce((a, b) => {
      return a + b.primary;
    }, 0)
  }

  /**
   * get area pob
   *
   * @returns {number}
   */
  get area_total_pob() {
    return this.headquarters.reduce((a, b) => {
      return a + b.total_pob;
    }, 0)
  }

  /**
   * get area visits
   *
   * @returns {number}
   */
  get area_total_visit() {
    return this.headquarters.reduce((a, b) => {
      return a + b.total_visit;
    }, 0)
  }

  /**
   * get total attendance
   *
   * @returns {number}
   */
  get area_total_att() {
    return this.headquarters.reduce((a, b) => {
      return a + b.total_att;
    }, 0)
  }

  get retailer_count(): number {
    let total: number = 0;
    this.customer_types.map(cus => {
      if (cus.name == "Retailer") {
        total = cus.brick_count
      }
    });
    return total;
  }

  get semi_count(): number {
    let total: number = 0;
    this.customer_types.map(cus => {
      if (cus.name == "Semi") {
        total = cus.brick_count
      }
    });
    return total;
  }

  get hub_count(): number {
    let total: number = 0;
    this.customer_types.map(cus => {
      if (cus.name == "Hub Chemist") {
        total = cus.brick_count
      }
    });
    return total;
  }

  get phy_count(): number {
    let total: number = 0;
    this.customer_types.map(cus => {
      if (cus.name == "Physician") {
        total = cus.brick_count
      }
    });
    return total;
  }

  /**
   * Total Shortfall
   *
   * @returns {number}
   */
  get last_month_shortfall() {
    return (this.ar_last_year_total / 12 - this.ar_last_month_total) > 0 ?
      (this.ar_last_year_total / 12 - this.ar_last_month_total).toFixed(2) : 0
  }


  /**
   * Total Shortfall for dexona
   *
   * @returns {number}
   */
  get last_month_dexona_shortfall() {
    return (this.ar_last_year_dexona_total / 12 - this.ar_last_month_dexona_total) > 0 ?
      (this.ar_last_year_dexona_total / 12 - this.ar_last_month_dexona_total).toFixed(2) : 0
  }

  /**
   * month Expected Sales
   *
   * @returns {number}
   */
  get current_month_expected() {
    return (2 * (this.ar_last_year_total) - this.ar_last_month_total) > 0 ?
      (2 * (this.ar_last_year_total / 12) - this.ar_last_month_total).toFixed(2) : 0;
  }


  /**
   * month Expected Sales for dexona
   *
   * @returns {number}
   */
  get current_month_expected_dexona() {
    return (2 * (this.ar_last_year_dexona_total) - this.ar_last_month_dexona_total) > 0 ?
      (2 * (this.ar_last_year_dexona_total / 12) - this.ar_last_month_dexona_total).toFixed(2) : 0;
  }


  get closing_qty(): number {
    return this.adjustment + this.opening - this.secondary_sale;
  }

  get closing_amount(): number {
    return (this.opening + this.total_net_amount + this.adjustment) - this.secondary_sale;
  }

  /**
   * Call Average Greater Than 95% With Norm 25
   */
  get callAverageGreaterThan95PercentageWith25() {
    return this.total_att > 0 ? (this.all_total_visit / this.total_att) >= 23 : false;
  }

  /**
   * Call Average Greater Than 95% With Norm 25
   */
  get callAverageBetween85To95PercentageWith25() {
    return this.total_att > 0 ? ((this.all_total_visit / this.total_att) >= 21 && (this.all_total_visit / this.total_att) <= 22 ) : false;
  }

  /**
   * Call Average Greater Than 95% With Norm 25
   */
  get callAverageLessThan85PercentageWith25() {
    return this.total_att > 0 ? (this.all_total_visit / this.total_att) < 21 : false;
  }

  /**
   * Customer Met HQ Count
   *
   * @param customer_type_id
   * @param aboveCount
   * @returns {boolean}
   */
  customerMetAbove(customer_type_id, aboveCount) {
    if (customer_type_id == 2 && this.semi_total_visit_count && this.total_att > 0)
      return (this.semi_total_visit_count / this.total_att).toFixed(3) >= aboveCount;
    else if (customer_type_id == 3 && this.retailer_total_visit_count > 0 && this.total_att > 0)
      return (this.retailer_total_visit_count / this.total_att).toFixed(3) >= aboveCount;
    else if (customer_type_id == 5 && this.hcp_total_visit_count > 0 && this.total_att > 0)
      return (this.hcp_total_visit_count / this.total_att).toFixed(3) >= aboveCount;
  }

  /**
   * Customer Met Between
   *
   * @param customer_type_id
   * @param aboveCount
   * @param belowCount
   * @returns {boolean}
   */
  customerMetBetween(customer_type_id, aboveCount, belowCount) {
    if (customer_type_id == 2 && this.semi_total_visit_count > 0 && this.total_att > 0) {
      return (this.semi_total_visit_count / this.total_att).toFixed(3) >= aboveCount
        && (this.semi_total_visit_count / this.total_att).toFixed(3) < belowCount;
    }
    else if (customer_type_id == 3 && this.retailer_total_visit_count > 0 && this.total_att > 0) {
      return (this.retailer_total_visit_count / this.total_att).toFixed(3) >= aboveCount
        && (this.retailer_total_visit_count / this.total_att).toFixed(3) < belowCount;
    }
    else if (customer_type_id == 5 && this.hcp_total_visit_count > 0 && this.total_att > 0) {
      return (this.hcp_total_visit_count / this.total_att).toFixed(3) >= aboveCount
        && (this.hcp_total_visit_count / this.total_att).toFixed(3) < belowCount;
    }
  }

  /**
   * Customer Below Count
   *
   * @param customer_type_id
   * @param belowCount
   * @returns {boolean}
   */
  customerMetBelow(customer_type_id, belowCount) {
    if (customer_type_id == 2 && this.semi_total_visit_count > 0 && this.total_att > 0)
      return (this.semi_total_visit_count / this.total_att).toFixed(3) < belowCount;
    else if (customer_type_id == 3 && this.retailer_total_visit_count > 0 && this.total_att > 0)
      return (this.retailer_total_visit_count / this.total_att).toFixed(3) < belowCount;
    else if (customer_type_id == 5 && this.hcp_total_visit_count > 0 && this.total_att > 0)
      return (this.hcp_total_visit_count / this.total_att).toFixed(3) < belowCount;
  }

  /**
   * POB per day Above 95%
   * @returns {boolean}
   */
  get pobPerDayGreaterThan95Percentage() {
    return this.total_att > 0 ? this.total_pob/this.total_att >= 9500 : false;
  }

  /**
   * POB per day Between 85 to 95%
   * @returns {boolean}
   */
  get pobPerDayBetween85To95Percentage() {
    return this.total_att > 0 ? this.total_pob / this.total_att >= 8500 && this.total_pob / this.total_att < 9500 : false;
  }

  /**
   * POB per day below 85%
   *
   * @returns {boolean}
   */
  get pobPerDayBelow85Percentage() {
    return this.total_att > 0 ? this.total_pob / this.total_att < 8500 : false;
  }

  /**
   * Minimum Productive Call Above 95%
   * @returns {boolean}
   */
  get minimumProductiveCallsAbove() {
    return this.total_att > 0 ? this.total_order / this.total_att >= 4.75 : false;
  }

  /**
   * Minimum Productive call Between
   * @returns {boolean}
   */
  get minimumProductiveCallsBetween() {
    return this.total_att > 0 ? this.total_order / this.total_att >= 4.25 && this.total_order / this.total_att < 4.75 : false;
  }

  /**
   * Minimum Productive Calls Between
   *
   * @returns {boolean}
   */
  get minimumProductiveCallBelow() {
    return this.total_att > 0 ? this.total_order / this.total_att < 4.25 : false;
  }

  /**
   * Customer Met HQ Count
   *
   * @param customer_type_id
   * @returns {boolean}
   */
  customerMetValue(customer_type_id) {
    if (customer_type_id == 2 && this.semi_total_visit_count && this.total_att > 0)
      return (this.semi_total_visit_count / this.total_att).toFixed(0);
    else if (customer_type_id == 3 && this.retailer_total_visit_count > 0 && this.total_att > 0)
      return (this.retailer_total_visit_count / this.total_att).toFixed(0);
    else if (customer_type_id == 5 && this.hcp_total_visit_count > 0 && this.total_att > 0)
      return (this.hcp_total_visit_count / this.total_att).toFixed(0);
  }
}
