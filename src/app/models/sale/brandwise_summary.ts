import { MonthlyAttendanceComponent } from "app/components/pages/attendance/monthly/monthly.component";
import {Model} from "../model";

export class BrandWiseSummary extends Model {

  department_id: number;
  detail_flag: number;
  id: number;
  last_year_same_month: number;
  name: string;
  total_net_amt: number;
  pob_amount: number;
  total_target: number;
  ytd_sale: number;
  ytd_target: number;
  last_month_sale: number;
  last_to_last_month_sale: number;

  icon_last_year_same_month: number = 0;
  icon_name: string;
  icon_net_amt: number = 0;
  icon_pob_amount: number = 0;
  icon_target: number = 0;
  icon_ytd_sale: number = 0;
  icon_ytd_target: number = 0;
  icon_lastmonthsale: number = 0;
  icon_lasttolastmonthsale: number = 0;

  chl_last_year_same_month: number = 0;
  chl_name: string;
  chl_net_amt: number = 0;
  chl_pob_amount: number = 0;
  chl_target: number = 0;
  chl_ytd_sale: number = 0;
  chl_ytd_target: number = 0;
  chl_lastmonthsale: number = 0;
  chl_lasttolastmonthsale: number = 0;

  constructor(info: any) {
    super(info.id);
    this.name = info.name;
    this.department_id = info.department_id;

    this.total_net_amt = parseFloat(info.total_net_amt);

    this.pob_amount = parseFloat(info.pob_amount);

    this.ytd_sale = parseFloat(info.ytd_sale);

    this.last_month_sale = parseFloat(info.last_month_sale);

    this.last_to_last_month_sale = parseFloat(info.last_to_last_month_sale);

    this.last_year_same_month = parseFloat(info.last_year_same_month);

    this.ytd_target = parseFloat(info.ytd_target);
    this.total_target = parseFloat(info.total_target);

    if ( this.department_id == 1 ) {
      this.icon_name = this.name;
      this.icon_net_amt =  this.total_net_amt;
      this.icon_pob_amount =  this.pob_amount;
      this.icon_ytd_sale =  this.ytd_sale;
      this.icon_lastmonthsale =  this.last_month_sale;
      this.icon_lasttolastmonthsale =  this.last_to_last_month_sale;
      this.icon_last_year_same_month =  this.last_year_same_month;
      this.icon_ytd_target =  this.ytd_target;
      this.icon_target =  this.total_target;
    }

    if ( this.department_id == 2 ) {
      this.chl_name = this.name;
      this.chl_net_amt =  this.total_net_amt;
      this.chl_pob_amount =  this.pob_amount;
      this.chl_ytd_sale =  this.ytd_sale;
      this.chl_lastmonthsale =  this.last_month_sale;
      this.chl_lasttolastmonthsale =  this.last_to_last_month_sale;
      this.chl_last_year_same_month =  this.last_year_same_month;
      this.chl_ytd_target =  this.ytd_target;
      this.chl_target =  this.total_target;
    }
  }
}
