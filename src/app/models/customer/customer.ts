import {Model} from "../model";
import {CustomerType} from "./customer_type";
import {Grade} from "./grade";
import {Address} from "cluster";
import {Brick} from "../territory/brick";
import {Territory} from "../territory/territory";
import {Input} from "@angular/core";
import {Product} from "../order/product";
import {Headquarter} from "../territory/headquarter";
import {Region} from "../territory/region";
import {Area} from "../territory/area";
import {SalesPlanningDetail} from "../plan";
import {HQZone} from '../territory/zone';
import {UserTerritoryCustomer} from './user_territory_customer';
import {DoctorType} from './doctor_type';
import {CustomerQualification} from './customer_qualification';
import {StockistSalesPlanning} from '../sale/stockist_sales_planning';
import {VisitInput} from '../visit/visit_input';

export class Customer extends Model {

  firm_name: string;
  owner_name: string;
  code: number;
  email: string;
  mobile: string;
  classification: string;
  customer_type_id: number;
  customer_type: CustomerType;
  doctor_qualifications: CustomerQualification[];
  doctor_type_id: number;
  doctor_speciality: string;
  doctorGroupName: string;
  doctor_type: DoctorType;
  grade_id: number;
  grade: Grade;
  status: string;
  approved_status: string;
  total_customers: number = 0;
  hq_brick_id: number;
  hq_territory_id: number;
  hq_headquarter_id: number;
  hq_area_id: number;
  hq_region_id: number;
  hq_zone_id: number;
  address: Address;
  synergy: boolean;
  hospital_name: string;

  brand_category: string;

  total_count: number = 0;

  // sales planning object
  plans: Object = {
    10: new SalesPlanningDetail({}),
    0: new SalesPlanningDetail({}),
  };

  total_avg_previous_year: number = 0;

  // total sales planning
  total_plan: SalesPlanningDetail = new SalesPlanningDetail({});

  visits_this_month_rep: string;
  visits_this_month_manager: string;

  hq_brick: Brick;
  hq_territory: Territory;
  hq_headquarter: Headquarter;
  hq_region: Region;
  hq_zone: HQZone;
  hq_area: Area;

  // for internal user only
  inputs: Input[];
  products: Product[];
  customer_types: CustomerType[];
  brick_counts: number = 0;
  visit_count: number = 0;
  order_count: number = 0;
  total_pob: number = 0;
  customer_count: number = 0;
  total_primary_sale: number = 0;

  last_year_sale: number = 0;
  last_year_dexona_sale: number = 0;
  last_month_sale: number = 0;
  last_month_dexona_sale: number = 0;
  visit_counts: number = 0;
  sap_primary_sale: number = 0;
  sales_planning: StockistSalesPlanning[];

  user_territory_customers: UserTerritoryCustomer[] = [];
  constructor(info: any) {
    super(info.id);
    this.firm_name = info.firm_name;
    this.owner_name = info.owner_name;
    this.mobile = info.mobile;
    this.email = info.email;
    this.classification = info.classification;
    this.customer_type = info.customer_type;
    this.customer_type_id = info.customer_type_id;
    this.doctor_type = info.doctor_type;
    this.doctor_type_id = info.doctor_type_id;
    this.doctor_speciality = info.doctor_speciality;
    this.doctorGroupName = info.doctorGroupName;
    this.grade_id = info.grade_id;
    this.grade = info.grade;
    this.status = info.status;
    this.approved_status = info.approved_status;
    this.hospital_name = info.hospital_name;
    if (info.total_customers)
      this.total_customers = parseInt(info.total_customers);
    this.hq_brick_id = info.hq_brick_id;
    this.hq_territory_id = info.hq_territory_id;
    this.hq_headquarter_id = info.hq_headquarter_id;
    this.hq_area_id = info.hq_area_id;
    this.hq_region_id = info.hq_region_id;
    this.hq_zone_id = info.hq_zone_id;
    this.address = info.address;
    this.code = info.code;
    this.synergy = info.synergy;
    this.visits_this_month_rep = info.visits_this_month_rep;
    this.visits_this_month_manager = info.visits_this_month_manager;

    // add brick
    if (info.hq_brick)
      this.hq_brick = new Brick(info.hq_brick);

    if (info.total_avg_previous_year)
      this.total_avg_previous_year = parseInt(info.total_avg_previous_year);

    // add territory
    if (info.hq_territory)
      this.hq_territory = new Territory(info.hq_territory);

    // add headquarter
    if (info.hq_headquarter)
      this.hq_headquarter = new Headquarter(info.hq_headquarter);

    // add area
    if (info.hq_area)
      this.hq_area = new Area(info.hq_area);

    // add region
    if (info.hq_region)
      this.hq_region = new Region(info.hq_region);

    // add zone
    if (info.hq_zone)
      this.hq_zone = new HQZone(info.hq_zone);

    // if (info.customer_qualifications)
    //   this.customer_qualifications = new CustomerQualification(info.customer_qualifications);

    if (info.brick_counts)
      this.brick_counts = parseInt(info.brick_counts);

    // visit count
    if (info.visit_count)
      this.visit_count = parseInt(info.visit_count);

    if (info.last_year_sale)
      this.last_year_sale = parseInt(info.last_year_sale);

    if (info.last_year_dexona_sale)
      this.last_year_dexona_sale = parseInt(info.last_year_dexona_sale);

    if (info.last_month_sale)
      this.last_month_sale = parseInt(info.last_month_sale);

    if (info.last_month_dexona_sale)
      this.last_month_dexona_sale = parseInt(info.last_month_dexona_sale);

    if (info.visit_counts)
      this.visit_counts = parseInt(info.visit_counts);

    if (info.sap_primary_sale)
      this.sap_primary_sale = parseInt(info.sap_primary_sale);

    if (info.total_count)
      this.total_count = parseInt(info.total_count);

    if (info.brand_category)
      this.brand_category = info.brand_category;

    if (info.sales_planning)
      this.sales_planning = info.sales_planning.map(function (plan) {
        return new StockistSalesPlanning(plan);
      });

    // add User territory customer
    if (info.user_territory_customers)
      this.user_territory_customers = info.user_territory_customers.map(user_territory_customer => new UserTerritoryCustomer(user_territory_customer));
  }

  /**
   * Total Shortfall
   *
   * @returns {number}
   */
  get last_month_shortfall() {
    return (this.last_year_sale / 12 - this.last_month_sale) > 0 ?
      (this.last_year_sale / 12 - this.last_month_sale).toFixed(2) : 0
  }


  /**
   * Total Shortfall for dexona
   *
   * @returns {number}
   */
  get last_month_dexona_shortfall() {
    return (this.last_year_dexona_sale / 12 - this.last_month_dexona_sale) > 0 ?
      (this.last_year_dexona_sale / 12 - this.last_month_dexona_sale).toFixed(2) : 0
  }

  /**
   * month Expected Sales
   *
   * @returns {number}
   */
  get current_month_expected() {
    return (2 * (this.last_year_sale) - this.last_month_sale) > 0 ?
      (2 * (this.last_year_sale / 12) - this.last_month_sale).toFixed(2) : 0;
  }


  /**
   * month Expected Sales for dexona
   *
   * @returns {number}
   */
  get current_month_expected_dexona() {
    return (2 * (this.last_year_dexona_sale) - this.last_month_dexona_sale) > 0 ?
      (2 * (this.last_year_dexona_sale / 12) - this.last_month_dexona_sale).toFixed(2) : 0;
  }
}
