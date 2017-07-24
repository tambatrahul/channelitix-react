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

export class Result {

  // territory arrays
  countries: Country[];
  regions: Region[];
  areas: Area[];
  territories: Territory[];
  headquarters: Headquarter[];
  bricks: Brick[];

  // attendances models
  attendance: Attendance;
  attendances: Attendance[];
  work_types: WorkType[];
  leave_types: LeaveType[];

  //Visits models
  visits: Visit[];
  all_visits: Visit[];
  v2_v3_visits: Visit[];
  inputs: VisitInput[];

  //Orders models
  orders: Order[];
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

  // customer models
  customer: Customer;
  customers: Customer[];
  hq_wise_customers: Customer[];
  customer_types: CustomerType[];
  customer_grades: Grade[];
  grades: Grade[];

  // total number
  total: number;

  // stps
  stps: Stp[];

  // secondary sales
  secondary_sales: SecondarySale[];

  // primary sales
  primary_sales: PrimarySale[];

  // invoice detail
  invoice_details: InvoiceDetail[];

  // products
  products: Product[] = [];

  last_month_dexona_sale: SapStockistSale[] = [];
  last_month_sale: SapStockistSale[] = [];
  last_month_sales: SapStockistSale[] = [];
  yearly_sales: SapStockistSale[] = [];
  yearly_dexona_sales: SapStockistSale[] = [];
  current_month_sale: SapStockistSale[] = [];
  visits_this_month_manager: Visit[] = [];
  visits_this_month_rep: Visit[] = [];
  opening_stocks: OpeningStock[] = [];

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
  sap_targets: Target[];

  // brick customer counts
  brick_customer_counts: BrickCustomerCount[];
}
