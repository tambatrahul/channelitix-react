import {Model} from "../model";
import {Area} from "./area";
import {CustomerType} from "../customer/customer_type";
import {Customer} from "../customer/customer";
import {User} from "../user/user";
import {InputAnswer} from "../visit/input_answer";
import {cookieServiceFactory} from "angular2-cookie/core";

export class Headquarter extends Model {

  name: string;
  status: string;
  total: number = 0;
  parent_headquarter_id: number;
  hq_area: Area;

  // for internal user only
  customer_types: CustomerType[];
  total_bricks: number = 0;
  target: number = 0;
  skinlite_target: number = 0;
  gelusil_target: number = 0;
  becosules_target: number = 0;
  yearly_target: number = 0;
  primary: number = 0;
  skinlite_primary: number = 0;
  gelusil_primary: number = 0;
  becosules_primary: number = 0;
  yearly_primary: number = 0;
  total_pob: number = 0;
  skinlite_total_pob: number = 0;
  gelusil_total_pob: number = 0;
  becosules_total_pob: number = 0;
  fw_days: number = 0;
  total_visit: number = 0;
  total_visit_ab: number = 0;
  all_total_visit: number = 0;
  total_att: number = 0;
  total_order: number = 0;
  total_customers: number = 0;
  order_count: number = 0;
  customer_count: number = 0;
  visit_count: number = 0;
  total_customers_ab: number = 0;
  total_net_amount: number = 0;
  hq_area_id: number = 0;
  customer_type_id: number = 0;

  territories_count: number = 0;
  bricks_count: number = 0;
  customers: Customer[] = [];
  inputs: InputAnswer[] = [];

  hq_last_year_total: number = 0;
  hq_last_year_dexona_total: number = 0;
  hq_last_month_total: number = 0;
  hq_last_month_dexona_total: number = 0;

  unit_price: number = 0;
  opening: number = 0;
  opening_value: number = 0;
  adjustment: number = 0;
  secondary_sale: number = 0;
  secondary_amount: number = 0;
  closing: number = 0;
  closing_value: number = 0;

  casual_leave: number = 0;
  sick_leave: number = 0;
  privilege_leave: number = 0;
  total_input_value: number = 0;

  customer_total_visit_count: number = 0;
  stockist_total_visit_count: number = 0;
  semi_total_visit_count: number = 0;
  retailer_total_visit_count: number = 0;
  hcp_total_visit_count: number = 0;
  hub_chemist_total_visit_count: number = 0;

  customer_total_count: number = 0;
  stockist_total_count: number = 0;
  semi_total_count: number = 0;
  retailer_total_count: number = 0;
  hcp_total_count: number = 0;
  hub_chemist_total_count: number = 0;
  total_primary: number = 0;

  user: User;
  norm: number = 0;

  constructor(info: any) {
    super(info.id);
    this.name = info.name;
    this.total = info.total;

    this.customer_types = info.customer_types;

    if (info.customers)
      this.customers = info.customers.map(customer => new Customer(customer));

    if (info.hq_area)
      this.hq_area = new Area(info.hq_area);

    if (info.status)
      this.status = info.status;

    if (info.territories_count)
      this.territories_count = info.territories_count.aggregate;

    if (info.bricks_count)
      this.bricks_count = info.bricks_count.aggregate;

    if (info.total_bricks)
      this.total_bricks = parseInt(info.total_bricks);

    if (info.order_count)
      this.order_count = parseInt(info.order_count);

    if (info.visit_count)
      this.visit_count = parseInt(info.visit_count);

    if (info.total_customers)
      this.total_customers = parseInt(info.total_customers);

    if (info.customer_count)
      this.customer_count = parseInt(info.customer_count);

    if (info.total_net_amount)
      this.total_net_amount = parseInt(info.total_net_amount);

    if (info.hq_area_id)
      this.hq_area_id = parseInt(info.hq_area_id);

    if (info.target)
      this.target = parseInt(info.target);

    if (info.total_order)
      this.total_order = parseInt(info.total_order);

    if (info.hq_last_year_total)
      this.hq_last_year_total = parseInt(info.hq_last_year_total);

    if (info.hq_last_year_dexona_total)
      this.hq_last_year_dexona_total = parseInt(info.hq_last_year_dexona_total);

    if (info.hq_last_month_total)
      this.hq_last_month_total = parseInt(info.hq_last_month_total);

    if (info.hq_last_month_dexona_total)
      this.hq_last_month_dexona_total = parseInt(info.hq_last_month_dexona_total);

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

    if (info.casual_leave)
      this.casual_leave = parseInt(info.casual_leave);

    if (info.sick_leave)
      this.sick_leave = parseInt(info.sick_leave);

    if (info.privilege_leave)
      this.privilege_leave = parseInt(info.privilege_leave);

    if (info.total_input_value)
      this.total_input_value = parseInt(info.total_input_value);

    if (info.parent_headquarter_id)
      this.parent_headquarter_id = parseInt(info.parent_headquarter_id);
  }

  /**
   * get total number of customers
   *
   * @returns {number}
   */
  get total_customer(): number {
    let total: number = 0;
    this.customer_types.map(cus => {
      cus.grades.map(grade => {
        if (grade.customer_count)
          total += grade.customer_count;
      })
    });
    return total;
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
      if (cus.name == "Healthcare Provider") {
        total = cus.brick_count
      }
    });
    return total;
  }

  /**
   * check if headquarter is on budget.
   * @returns {boolean}
   */
  get onBudget() {
    if (this.target > 0)
      return this.primary >= this.target;
    else
      return false;
  }

  /**
   * check if headquarter is on 90% budget.
   * @returns {boolean}
   */
  get onBudget90() {
    if (this.target > 0)
      return this.primary >= (this.target * 0.9) && this.primary < this.target;
    else
      return false;
  }

  /**
   * check if headquarter is on less than 90% budget.
   * @returns {boolean}
   */
  get onBudgetLess90() {
    if (this.target > 0)
      return this.primary < (this.target * 0.9);
    return true;
  }

  /**
   * check if headquarter is on target.
   * @returns {boolean}
   */
  get onTarget() {
    if (this.total_pob > 0) {
      return this.total_pob >= (this.target * 0.5);
    }
  }

  /**
   * percentage coverage
   *
   * @returns {number}
   */
  get call_average() {
    return this.total_att > 0 ? (this.total_visit / this.total_att) : 0;
  }

  /**
   * get total attendances as per norm
   * @returns {boolean}
   */
  get attAsPerNorm23() {
    return this.total_att >= 23;
  }

  /**
   * get total attendances as per norm
   * @returns {boolean}
   */
  get coverageAsPerNorm85() {
    if (this.total_customers > 0) {
      return ((this.total_visit / this.total_customers) * 100) > 85;
    }

    return false;
  }

  /**
   * get total customers
   * @returns {number}
   */
  get coverage() {
    if (this.total_visit_ab > 0)
      return ((this.total_visit_ab / this.total_customers_ab) * 100);
    else
      return 0;
  }

  /**
   * Total Shortfall
   *
   * @returns {number}
   */
  get last_month_shortfall() {
    let value = (this.hq_last_year_total / 12 - this.hq_last_month_total) > 0 ?
      (this.hq_last_year_total / 12 - this.hq_last_month_total).toFixed(2) : 0;
    if (value > 0)
      return value;
    else
      return 0;
  }


  /**
   * Total Shortfall for dexona
   *
   * @returns {number}
   */
  get last_month_dexona_shortfall() {
    let value = (this.hq_last_year_dexona_total / 12 - this.hq_last_month_dexona_total) > 0 ?
      (this.hq_last_year_dexona_total / 12 - this.hq_last_month_dexona_total).toFixed(2) : 0;
    if (value > 0)
      return value;
    else
      return 0;
  }

  /**
   * month Expected Sales
   *
   * @returns {number}
   */
  get current_month_expected() {
    let value = (2 * (this.hq_last_year_total) - this.hq_last_month_total) > 0 ?
      (2 * (this.hq_last_year_total / 12) - this.hq_last_month_total).toFixed(2) : 0;
    if (value > 0)
      return value;
    else
      return 0;
  }


  /**
   * month Expected Sales for dexona
   *
   * @returns {number}
   */
  get current_month_expected_dexona() {
    let value = (2 * (this.hq_last_year_dexona_total) - this.hq_last_month_dexona_total) > 0 ?
      (2 * (this.hq_last_year_dexona_total / 12) - this.hq_last_month_dexona_total).toFixed(2) : 0;
    if (value > 0)
      return value;
    else
      return
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
   * Coverage For Percentage Greater Than
   */
  customerCoverageAbove(customer_type_id, percentage) {
    if (customer_type_id) {
      if (customer_type_id == 1 && this.stockist_total_visit_count > 0 && this.stockist_total_count > 0)
        return (this.stockist_total_visit_count / this.stockist_total_count).toFixed(2) >= percentage;
      else if (customer_type_id == 2 && this.semi_total_visit_count > 0 && this.semi_total_count > 0)
        return (this.semi_total_visit_count / this.semi_total_count).toFixed(2) >= percentage;
      else if (customer_type_id == 3 && this.retailer_total_visit_count > 0 && this.retailer_total_count > 0)
        return (this.retailer_total_visit_count / this.retailer_total_count).toFixed(2) >= percentage;
      else if (customer_type_id == 4 && this.hub_chemist_total_visit_count > 0 && this.hub_chemist_total_count > 0)
        return (this.hub_chemist_total_visit_count / this.hub_chemist_total_count).toFixed(2) >= percentage;
      else if (customer_type_id == 5 && this.hcp_total_visit_count > 0 && this.hcp_total_count > 0)
        return (this.hcp_total_visit_count / this.hcp_total_count).toFixed(2) >= percentage;
    } else {
      return (this.customer_total_visit_count / this.customer_total_count).toFixed(2) >= percentage;
    }
  }

  /**
   * Coverage For Between 85 To 95 Percentage
   */
  customerCoverageBetween(customer_type_id, above_percentage, below_percentage) {
    if (customer_type_id) {
      if (customer_type_id == 1 && this.stockist_total_visit_count > 0 && this.stockist_total_count > 0) {
        return (this.stockist_total_visit_count / this.stockist_total_count).toFixed(2) >= above_percentage
          && (this.stockist_total_visit_count / this.stockist_total_count).toFixed(2) < below_percentage;
      }
      else if (customer_type_id == 2 && this.semi_total_visit_count > 0 && this.semi_total_count > 0) {
        return (this.semi_total_visit_count / this.semi_total_count).toFixed(2) >= above_percentage
          && (this.semi_total_visit_count / this.semi_total_count).toFixed(2) < below_percentage;
      }
      else if (customer_type_id == 3 && this.retailer_total_visit_count > 0 && this.retailer_total_count > 0) {
        return (this.retailer_total_visit_count / this.retailer_total_count).toFixed(2) >= above_percentage
          && (this.retailer_total_visit_count / this.retailer_total_count).toFixed(2) < below_percentage;
      }
      else if (customer_type_id == 4 && this.hub_chemist_total_visit_count > 0 && this.hub_chemist_total_count > 0) {
        return (this.hub_chemist_total_visit_count / this.hub_chemist_total_count).toFixed(2) >= above_percentage
          && (this.hub_chemist_total_visit_count / this.hub_chemist_total_count).toFixed(2) < below_percentage;
      }
      else if (customer_type_id == 5 && this.hcp_total_visit_count > 0 && this.hcp_total_count > 0) {
        return (this.hcp_total_visit_count / this.hcp_total_count).toFixed(2) >= above_percentage
          && (this.hcp_total_visit_count / this.hcp_total_count).toFixed(2) < below_percentage;
      }
    } else {
      return (this.customer_total_visit_count / this.customer_total_count).toFixed(2) >= above_percentage
        && (this.customer_total_visit_count / this.customer_total_count).toFixed(2) < below_percentage;
    }
  }

  /**
   * Coverage Below 85 Percentage
   */
  customerCoverageBelow(customer_type_id, percentage) {
    if (customer_type_id) {
      if (customer_type_id == 1 && this.stockist_total_visit_count > 0 && this.stockist_total_count > 0)
        return (this.stockist_total_visit_count / this.stockist_total_count).toFixed(2) < percentage;
      else if (customer_type_id == 2 && this.semi_total_visit_count > 0 && this.semi_total_count > 0)
        return (this.semi_total_visit_count / this.semi_total_count).toFixed(2) < percentage;
      else if (customer_type_id == 3 && this.retailer_total_visit_count > 0 && this.retailer_total_count > 0)
        return (this.retailer_total_visit_count / this.retailer_total_count).toFixed(2) < percentage;
      else if (customer_type_id == 4 && this.hub_chemist_total_visit_count > 0 && this.hub_chemist_total_count > 0)
        return (this.hub_chemist_total_visit_count / this.hub_chemist_total_count).toFixed(2) < percentage;
      else if (customer_type_id == 5 && this.hcp_total_visit_count > 0 && this.hcp_total_count > 0)
        return (this.hcp_total_visit_count / this.hcp_total_count).toFixed(2) < percentage;
    } else {
      return (this.customer_total_visit_count / this.customer_total_count).toFixed(2) < percentage;
    }
  }

  /**
   * Customer Met HQ Count
   *
   * @param customer_type_id
   * @param aboveCount
   * @returns {boolean}
   */
  customerMetAbove(customer_type_id, aboveCount) {
    if (customer_type_id == 2 && this.semi_total_visit_count > 0 && this.semi_total_count > 0 && this.total_att > 0)
      return ((this.semi_total_visit_count / this.semi_total_count) / this.total_att).toFixed(3) >= aboveCount;
    else if (customer_type_id == 3 && this.retailer_total_visit_count > 0 && this.retailer_total_count > 0 && this.total_att > 0)
      return ((this.retailer_total_visit_count / this.retailer_total_count) / this.total_att).toFixed(3) >= aboveCount;
    else if (customer_type_id == 5 && this.hcp_total_visit_count > 0 && this.hcp_total_count > 0 && this.total_att > 0)
      return ((this.hcp_total_visit_count / this.hcp_total_count) / this.total_att).toFixed(3) >= aboveCount;
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
    if (customer_type_id == 2 && this.semi_total_visit_count > 0 && this.semi_total_count > 0 && this.total_att > 0) {
      return ((this.semi_total_visit_count / this.semi_total_count) / this.total_att).toFixed(3) >= aboveCount
        && ((this.semi_total_visit_count / this.semi_total_count) / this.total_att).toFixed(3) < belowCount;
    }
    else if (customer_type_id == 3 && this.retailer_total_visit_count > 0 && this.retailer_total_count > 0 && this.total_att > 0) {
      return ((this.retailer_total_visit_count / this.retailer_total_count) / this.total_att).toFixed(3) >= aboveCount
        && ((this.retailer_total_visit_count / this.retailer_total_count) / this.total_att).toFixed(3) < belowCount;
    }
    else if (customer_type_id == 5 && this.hcp_total_visit_count > 0 && this.hcp_total_count > 0 && this.total_att > 0) {
      return ((this.hcp_total_visit_count / this.hcp_total_count) / this.total_att).toFixed(3) >= aboveCount
        && ((this.hcp_total_visit_count / this.hcp_total_count) / this.total_att).toFixed(3) < belowCount;
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
    if (customer_type_id == 2 && this.semi_total_visit_count > 0 && this.semi_total_count > 0 && this.total_att > 0)
      return ((this.semi_total_visit_count / this.semi_total_count) / this.total_att).toFixed(3) < belowCount;
    else if (customer_type_id == 3 && this.retailer_total_visit_count > 0 && this.retailer_total_count > 0 && this.total_att > 0)
      return ((this.retailer_total_visit_count / this.retailer_total_count) / this.total_att).toFixed(3) < belowCount;
    else if (customer_type_id == 5 && this.hcp_total_visit_count > 0 && this.hcp_total_count > 0 && this.total_att > 0)
      return ((this.hcp_total_visit_count / this.hcp_total_count) / this.total_att).toFixed(3) < belowCount;
  }

  /**
   * POB per day Above 95%
   * @returns {boolean}
   */
  get pobPerDayGreaterThan95Percentage() {
    return this.total_att > 0 ? this.total_pob / this.total_att >= 9500 : false;
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
   * Percentage POB To Primary Sale Above
   * @returns {boolean}
   */
  get percentagePOBToPrimarySaleAbove() {
    return this.total_primary > 0 ? this.total_pob / this.total_primary >= 0.38 : false;
  }

  /**
   * Percentage POB To Primary Sale Betwwen
   * @returns {boolean}
   */
  get percentagePOBToPrimarySaleBetween() {
    return this.total_primary > 0 ? this.total_pob / this.total_primary >= 0.34 && this.total_pob / this.total_primary < 0.38 : false;
  }

  /**
   * Percentage POB To Primary Sale Below
   * @returns {boolean}
   */
  get percentagePOBToPrimarySaleBelow() {
    return this.total_primary > 0 ? this.total_pob / this.total_primary < 0.34 : false;
  }

  /**
   * Coverage For Percentage Greater Than Value
   */
  customerCoverageValue(customer_type_id) {
    if (customer_type_id) {
      if (customer_type_id == 1 && this.stockist_total_visit_count > 0 && this.stockist_total_count > 0)
        return ((this.stockist_total_visit_count / this.stockist_total_count) * 100).toFixed(2);
      else if (customer_type_id == 2 && this.semi_total_visit_count > 0 && this.semi_total_count > 0)
        return ((this.semi_total_visit_count / this.semi_total_count) * 100).toFixed(2);
      else if (customer_type_id == 3 && this.retailer_total_visit_count > 0 && this.retailer_total_count > 0)
        return ((this.retailer_total_visit_count / this.retailer_total_count) * 100).toFixed(2);
      else if (customer_type_id == 4 && this.hub_chemist_total_visit_count > 0 && this.hub_chemist_total_count > 0)
        return ((this.hub_chemist_total_visit_count / this.hub_chemist_total_count) * 100).toFixed(2);
      else if (customer_type_id == 5 && this.hcp_total_visit_count > 0 && this.hcp_total_count > 0)
        return ((this.hcp_total_visit_count / this.hcp_total_count) * 100).toFixed(2);
    } else {
      return ((this.customer_total_visit_count / this.customer_total_count) * 100).toFixed(2);
    }
  }

  /**
   * Customer Met HQ Count
   *
   * @param customer_type_id
   * @returns {boolean}
   */
  customerMetValue(customer_type_id) {
    if (customer_type_id == 2 && this.semi_total_visit_count > 0 && this.semi_total_count > 0 && this.total_att > 0)
      return (((this.semi_total_visit_count / this.semi_total_count) / this.total_att) * 10).toFixed(2);
    else if (customer_type_id == 3 && this.retailer_total_visit_count > 0 && this.retailer_total_count > 0 && this.total_att > 0)
      return (((this.retailer_total_visit_count / this.retailer_total_count) / this.total_att) * 10).toFixed(2);
    else if (customer_type_id == 5 && this.hcp_total_visit_count > 0 && this.hcp_total_count > 0 && this.total_att > 0)
      return (((this.hcp_total_visit_count / this.hcp_total_count) / this.total_att) * 10).toFixed(2);
  }
}
