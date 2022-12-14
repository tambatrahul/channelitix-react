import {Attendance} from "./attendance/attendance";
import {User} from "./user/user";
import {Customer} from "./customer/customer";
import {CustomerType} from "./customer/customer_type";
import {Territory} from "./territory/territory";
import {Area} from "./territory/area";
import {Headquarter} from "./territory/headquarter";
import {Brick} from "./territory/brick";
import {Region} from "./territory/region";
import {Country} from "./territory/country";
import {Visit} from "./visit/visit";
import {Holiday} from "./holiday";
import {Order} from "./order/order";
import {WorkType} from "./attendance/work_type";
import {LeaveType} from "./attendance/leave_type";
import {Tour} from "./tour_program/tour";
import {Grade} from "./customer/grade";
import {Stp} from "./customer/stp";
import {Message} from "./message/message";
import {SecondarySale} from "./sale/secondary_sale";
import {Product} from "./order/product";
import {VisitInput} from "./visit/visit_input";
import {PrimarySale} from "./sale/primary_sale";
import {InvoiceDetail} from "./SAP/invoice_detail";
import {YearTillMonth} from "./SAP/year_till_month";
import {OrderItem} from "./order/order_item";
import {Target} from "./SAP/target";
import {BrickCustomerCount} from "./territory/brick_customer_count";
import {MonthStockistSale} from "./SAP/month_stockist_sale";
import {YearStockistSale} from "./SAP/year_stockist_sale";
import {SapStockistSale} from "./SAP/sap_stockist_sale";
import {OpeningStock} from "./openning_stock";
import {SalesPlanningDetail} from "./plan";
import {Brand} from "./order/brand";
import {SubName} from "./order/subname";
import {HQZone} from './territory/zone';
import {Priority} from './visit/priority';
import {UserInput} from './V2/user/user_input';
import {UserInputPos} from './visit/user_input_pos';
import {Expense} from './expense/expense';
import {DoctorType} from './customer/doctor_type';
import {CustomerQualification} from './customer/customer_qualification';
import {Department} from './user/department';
import {UserTraining} from './user/user_training';
import {Stockist} from './download/stockist';
import {BrickDownload} from './download/brick_download';
import {HeadquaterDownload} from './download/headquater_download';
import {PrimaryDownload} from './download/primary_download';
import {InputReport} from './download/input_report';
import {PriorityReport} from './download/priority_report';
import {CustomerReport} from './download/customer_report';
import {TargetReport} from './download/target_report';
import {Download} from './download/download';
import {PrimarySecondaryTarget} from './sale/primary_secondary_target';
import {BrandWiseSummary} from './sale/brandwise_summary';
import {SampleReport} from './download/sample_report';
import { UserLocation } from "./user/user_location";
import { PrimarySalesAndTargets } from "./V2/SAP/primary_sales_and_targets";
import { UserTrainingFiles } from "./user/user_training_files";

export class Result {

  // territory arrays
  countries: Country[];
  zones: HQZone[];
  regions: Region[];
  areas: Area[];
  territories: Territory[];
  headquarters: Headquarter[];
  bricks: Brick[];

  // attendances models
  attendance: Attendance;
  attendances: Attendance[];
  leave_counts: Attendance[];
  work_types: WorkType[];
  leave_types: LeaveType[];

  //Visits models
  visits: Visit[];
  visited_brick: Visit[];
  all_visits: Visit[];
  v2_v3_visits: Visit[];
  customer_type_wise_visits: Visit[];
  hq_visits: Visit[];
  inputs: VisitInput[];

  //Orders models
  orders: Order[];
  orders_csm: Order[];
  skinlite_orders: Order[];
  gelusil_orders: Order[];
  becosules_orders: Order[];
  orders_sk: number = 0;
  orders_synergy: number = 0;
  order_counts: Order[];

  // holidays models
  holidays: Holiday[];

  // tour models
  tours: Tour[];

  // Message models
  messages: Message[];

  // brick models
  brick: Brick;

  // users models
  user: User;
  users: User[];
  all_users: User[];
  attritions_month: User[];
  attritions_year: User[];
  manager: User;
  children: User[];
  user_training_files: UserTrainingFiles[] = [];

  // customer models
  customer: Customer;
  customer_total: number = 0;
  customers: Customer[];
  cus_total_customers: Customer[];
  hq_wise_customers: Customer[];
  customer_types: CustomerType[];
  doctor_types: DoctorType[];
  customer_grades: Grade[];
  grades: Grade[];
  customer_qualifications: CustomerQualification[];
  customer_qualification: CustomerQualification[];

  // targets and sales
  primary_sales_and_targets: PrimarySalesAndTargets[];

  // total number
  total: number;

  // search number
  search: string;

  // stps
  stps: Stp[];

  // secondary sales
  secondary_sales: SecondarySale[];

  // primary sales
  primary_sales: PrimarySale[];
  skinlite_primary_sales: PrimarySale[];
  gelusil_primary_sales: PrimarySale[];
  becosules_primary_sales: PrimarySale[];
  daily_sales: {};

  //brandwise summary
  brandWiseSales: BrandWiseSummary[];
  // total_summary: BrandWiseSummary;

  // primary sales
  geo_stockist_primary_sales: PrimarySale[];
  last_year_geo_stockist_primary_sales: PrimarySale[];
  liva_stockist_primary_sales: PrimarySale[];
  last_year_liva_stockist_primary_sales: PrimarySale[];
  common_stockist_primary_sales: PrimarySale[];
  last_year_common_stockist_primary_sales: PrimarySale[];

  // invoice detail
  invoice_details: InvoiceDetail[];

  // products
  products: Product[] = [];

  // brands
  brands: Brand[] = [];
  subname: SubName[] = [];
  portfolio_names: SubName[] = [];
  departments: Department[] = [];
  trainings: UserTraining[] = [];

  // priorities
  priorities: Priority[] = [];

  last_month_dexona_sale: SapStockistSale[] = [];
  last_month_sale: SapStockistSale[] = [];
  last_month_sales: SapStockistSale[] = [];
  yearly_sales: SapStockistSale[] = [];
  yearly_dexona_sales: SapStockistSale[] = [];
  current_month_sale: SapStockistSale[] = [];
  visits_this_month_manager: Visit[] = [];
  visits_this_month_rep: Visit[] = [];
  opening_stocks: OpeningStock[] = [];

  // sales planning variables
  sale_planning_details: SalesPlanningDetail[] = [];

  // get total counts for reports
  total_users: number = 0;
  total_active_users: number = 0;
  total_customers: number = 0;
  total_visits: number = 0;
  call_average: number = 0;
  productive_calls: number = 0;
  total_bricks: number = 0;
  total_headquarters: number = 0;
  total_orders: number = 0;
  performance_per: number = 0;
  skinlite_performance_per: number = 0;
  stockist_count: number =0;

  // target till month and sales till month
  year_till_month: YearTillMonth;

  // Sales for month and year
  monthly_sale: MonthStockistSale;
  yearly_sale: YearStockistSale;

  performance: Performance;

  // Product Wise sale
  product_wise_sale: OrderItem[];

  // targets
  targets: Target[];
  skinlite_targets: Target[];
  gelusil_targets: Target[];
  becosules_targets: Target[];
  sap_targets: Target[];

  // brick customer counts
  brick_customer_counts: BrickCustomerCount[];

  // vacant hq counts
  area_vacant_hq_counts: Area[];
  region_vacant_hq_counts: Region[];

  // Input Pos
  input_pos: UserInputPos[];
  // Expense
  expenses: Expense[];

  first_fortnight_expenses: Expense[];
  second_fortnight_expenses: Expense[];

  first_fortnight_attendances: Attendance[];
  second_fortnight_attendances: Attendance[];

  // Download
  stockists: Stockist[];
  brick_downloads: BrickDownload[];
  headquater_downloads: HeadquaterDownload[];
  primary_downloads: PrimaryDownload[];
  input_reports: InputReport[];
  priority_reports: PriorityReport[];
  customer_reports: CustomerReport[];
  target_reports: TargetReport[];
  sample_reports: SampleReport[];
  download: Download;

  stockist_list: Stockist[];

  primarysecondarysalestargets: PrimarySecondaryTarget[];

  month_sale_target: Brand[];

  user_locations: UserLocation[];

}
