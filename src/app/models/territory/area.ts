import {Model} from "../model";
import {CustomerType} from "../customer/customer_type";
import {Region} from "./region";
import {Headquarter} from "./headquarter";

export class Area extends Model {

  name: string;
  hq_region: Region;

  // for internal user only
  customer_types: CustomerType[];
  headquarters: Headquarter[] = [];
  total: number = 0;
  total_bricks: number = 0;
  target: number = 0;
  primary: number = 0;
  total_pob: number = 0;
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

  area_total_visits : number = 0;
  area_total_orders : number = 0;
  area_total_orders_amount : number = 0;
  area_total_customers : number = 0;
  area_total_customers_ordered : number = 0;

  constructor(info: any) {
    super(info.id);
    this.name = info.name;
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

    if (info.ar_last_year_total)
      this.ar_last_year_total = parseInt(info.ar_last_year_total);

    if (info.ar_last_year_dexona_total)
      this.ar_last_year_dexona_total = parseInt(info.ar_last_year_dexona_total);

    if (info.ar_last_month_total)
      this.ar_last_month_total = parseInt(info.ar_last_month_total);

    if (info.ar_last_month_dexona_total)
      this.ar_last_month_dexona_total = parseInt(info.ar_last_month_dexona_total);

    if(info.area_total_visits)
      this.area_total_visits = parseInt(info.area_total_visits);

    if(info.area_total_orders)
      this.area_total_orders = parseInt(info.area_total_orders);

    if(info.area_total_orders_amount)
      this.area_total_orders_amount = parseInt(info.area_total_orders_amount);

    if(info.area_total_customers)
      this.area_total_customers = parseInt(info.area_total_customers);

    if(info.area_total_customers_ordered)
      this.area_total_customers_ordered = parseInt(info.area_total_customers_ordered);
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
}
