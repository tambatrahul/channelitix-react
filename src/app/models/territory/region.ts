import {Model} from "../model";
import {CustomerType} from "../customer/customer_type";
import {Country} from "./country";
import {Area} from "./area";
import {Product} from "../order/product";
import {Customer} from "../customer/customer";
import {User} from "../user/user";
import {InputAnswer} from "../visit/input_answer";
import {Brand} from "../order/brand";
import {HQZone} from './zone';

export class Region extends Model {

  name: string;
  hq_zone: HQZone;

  // for internal user only
  customers: Customer[];
  customer_types: CustomerType[];
  areas: Area[] = [];
  area_objects = {};
  total: number = 0;
  quantity: number = 0;
  total_bricks: number = 0;
  target: number = 0;
  skinlite_target: number = 0;
  gelusil_target: number = 0;
  becosules_target: number = 0;
  primary: number = 0;
  skinlite_primary: number = 0;
  gelusil_primary: number = 0;
  becosules_primary: number = 0;
  total_pob: number = 0;
  skinlite_total_pob: number = 0;
  gelusil_total_pob: number = 0;
  becosules_total_pob: number = 0;
  total_visit: number = 0;
  total_visit_ab: number = 0;
  all_total_visit: number = 0;
  total_att: number = 0;
  fw_days: number = 0;
  total_order: number = 0;
  yearly_target: number = 0;
  yearly_primary: number = 0;
  products: Product[] = [];
  brands: Brand[] = [];
  total_customers: number = 0;

  areas_count: number = 0;
  territories_count: number = 0;
  headquarters_count: number = 0;
  bricks_count: number = 0;
  hub_physician_count: number = 0;

  customer_count: number = 0;
  active_users_count: number = 0;
  attritions_month_count: number = 0;
  attritions_year_count: number = 0;
  total_customers_ab: number = 0;

  rg_last_year_total: number = 0;
  rg_last_year_dexona_total: number = 0;
  rg_last_month_total: number = 0;
  rg_last_month_dexona_total: number = 0;

  region_total_visits: number = 0;
  region_total_orders: number = 0;
  region_total_orders_amount: number = 0;
  region_total_customers: number = 0;
  region_total_customers_ordered: number = 0;
  region_total_target: number = 0;

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
  vacant_hq_count: number = 0;
  norm: number = 0;

  constructor(info: any) {
    super(info.id);
    this.name = info.name;
    this.customer_types = info.customer_types;
    this.customers = info.customers;
    this.total = info.total;
    if (info.hq_zone) {
      this.hq_zone = new HQZone(info.hq_zone);
    }

    if (info.areas_count)
      this.areas_count = info.areas_count.aggregate;

    if (info.territories_count)
      this.territories_count = info.territories_count.aggregate;

    if (info.headquarters_count)
      this.headquarters_count = info.headquarters_count.aggregate;

    if (info.bricks_count)
      this.bricks_count = info.bricks_count.aggregate;

    if (info.hub_physician_count)
      this.hub_physician_count = parseInt(info.hub_physician_count);

    if (info.areas)
      this.areas = info.areas.map(area => new Area(area));

    if (info.total_order)
      this.total_order = parseInt(info.total_order);

    if (info.total_visit)
      this.total_visit = parseInt(info.total_visit);

    if (info.products)
      this.products = info.products.map(prd => new Product(prd));

    if (info.total_customers)
      this.total_customers = parseInt(info.total_customers);

    if (info.total_net_amount)
      this.total_net_amount = parseFloat(info.total_net_amount);
    
    if (info.total_net_quantity)
      this.total_net_quantity = parseFloat(info.total_net_quantity);

    if (info.rg_last_year_total)
      this.rg_last_year_total = parseInt(info.rg_last_year_total);

    if (info.rg_last_year_dexona_total)
      this.rg_last_year_dexona_total = parseInt(info.rg_last_year_dexona_total);

    if (info.rg_last_month_total)
      this.rg_last_month_total = parseInt(info.rg_last_month_total);

    if (info.rg_last_month_dexona_total)
      this.rg_last_month_dexona_total = parseInt(info.rg_last_month_dexona_total);

    if (info.region_total_visits)
      this.region_total_visits = parseInt(info.region_total_visits);

    if (info.region_total_orders)
      this.region_total_orders = parseInt(info.region_total_orders);

    if (info.region_total_orders_amount)
      this.region_total_orders_amount = parseInt(info.region_total_orders_amount);

    if (info.region_total_customers)
      this.region_total_customers = parseInt(info.region_total_customers);

    if (info.region_total_customers_ordered)
      this.region_total_customers_ordered = parseInt(info.region_total_customers_ordered);

    if (info.region_total_target)
      this.region_total_target = parseInt(info.region_total_target);

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
   * get total hq with norms
   */
  get total_hq_with_norms() {
    let total_count = 0;
    this.areas.map(area => {
      area.headquarters.map(hq => {
        let count = 0;
        if (hq.customer_types) {
          hq.customer_types.map(ct => {
            if (ct.visit_count > 0 && ct.id != 1)
              count += 1;
          });
          if (count == 4) {
            total_count += 1;
          }
        }
      });
    });
    return total_count;
  }

  get onTargetCount() {
    return this.products.filter(prd => prd.onTarget).length;
  }

  /**
   * region brands on target
   * @returns {number}
   */
  get onBrandTargetCount() {
    return this.brands.filter(br => br.onTarget).length;
  }

  /**
   * get count of hq on budget
   * @returns {number}
   */
  get onBudgetHq() {
    let total = 0;
    this.areas.map(area => {
      total += area.headquarters.filter(hq => hq.onBudget).length;
    });
    return total;
  }

  /**
   * get count of hq on 90 % budget
   * @returns {number}
   */
  get onBudgetHq90() {
    let total = 0;
    this.areas.map(area => {
      total += area.headquarters.filter(hq => hq.onBudget90).length;
    });
    return total;
  }

  /**
   * get count of hq on < 90 % budget
   * @returns {number}
   */
  get onBudgetHqLess90() {
    let total = 0;
    this.areas.map(area => {
      total += area.headquarters.filter(hq => hq.onBudgetLess90).length;
    });
    return total;
  }

  /**
   * total headquarters
   * @returns {number}
   */
  get totalHq() {
    let total = 0;
    this.areas.map(area => {
      total += area.headquarters.length;
    });
    return total;
  }

  /**
   * check if region is on target.
   * @returns {boolean}
   */
  get targetTo30() {
    if (this.target > 0)
      return (this.total_pob / (this.target)) * 100;

    return 0;
  }

  /**
   * check if region is on target.
   * @returns {boolean}
   */
  get onTarget() {
    return this.total_pob >= (this.target * 0.5);
  }

  /**
   * get headquarter above target
   * @returns {number}
   */
  get hqAboveTarget() {
    let total = 0;
    this.areas.map(area => {
      total += area.headquarters.filter(hq => {
        return hq.onTarget
      }).length;
    });
    return total;
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
   * hq count above call average
   * @returns {number}
   */
  get hqAboveCallAverage() {
    let total = 0;
    this.areas.map(area => {
      total += area.headquarters.filter(hq => hq.call_average > 25).length;
    });
    return total;
  }

  /**
   * hq count above call average
   * @returns {number}
   */
  get totalHqAttAsPerNorm23() {
    let total = 0;
    this.areas.map(area => {
      total += area.headquarters.filter(hq => hq.attAsPerNorm23).length;
    });
    return total;
  }

  /**
   * hq count above coverage 85
   * @returns {number}
   */
  get totalHqCoverageAsPerNorm85() {
    let total = 0;
    this.areas.map(area => {
      total += area.headquarters.filter(hq => hq.coverageAsPerNorm85).length;
    });
    return total;
  }

  /**
   * hq count
   * @returns {number}
   */
  get totalHqCoverage() {
    let total = 0;
    this.areas.map(area => {
      area.headquarters.map(hq => {
        total += hq.coverage;
      });
    });
    return total;
  }

  /**
   * Total Shortfall
   *
   * @returns {number}
   */
  get last_month_shortfall() {
    return (this.rg_last_year_total / 12 - this.rg_last_month_total) > 0 ?
      (this.rg_last_year_total / 12 - this.rg_last_month_total).toFixed(2) : 0
  }


  /**
   * Total Shortfall for dexona
   *
   * @returns {number}
   */
  get last_month_dexona_shortfall() {
    return (this.rg_last_year_dexona_total / 12 - this.rg_last_month_dexona_total) > 0 ?
      (this.rg_last_year_dexona_total / 12 - this.rg_last_month_dexona_total).toFixed(2) : 0
  }

  /**
   * month Expected Sales
   *
   * @returns {number}
   */
  get current_month_expected() {
    return (2 * (this.rg_last_year_total) - this.rg_last_month_total) > 0 ?
      (2 * (this.rg_last_year_total / 12) - this.rg_last_month_total).toFixed(2) : 0;
  }


  /**
   * month Expected Sales for dexona
   *
   * @returns {number}
   */
  get current_month_expected_dexona() {
    return (2 * (this.rg_last_year_dexona_total) - this.rg_last_month_dexona_total) > 0 ?
      (2 * (this.rg_last_year_dexona_total / 12) - this.rg_last_month_total).toFixed(2) : 0;
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
   * Customer Met Value
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
