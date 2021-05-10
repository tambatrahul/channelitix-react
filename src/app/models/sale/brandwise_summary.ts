import { MonthlyAttendanceComponent } from "app/components/pages/attendance/monthly/monthly.component";
import {Model} from "../model";

export class BrandWiseSummary extends Model {

  department_id: number;
  detail_flag: number;
  id: number;
  last_year_same_month: number;
  name: string;
  net_amt: number;
  pob_amount: number;
  target: number;
  ytd_sale: number;
  ytd_target: number;
  lastmonthsale: number;
  lasttolastmonthsale: number;


  constructor(info: any) {
    super(info.id);
    this.name = info.name;
    this.department_id = info.department_id;

    this.net_amt = parseFloat(info.net_amt);

    this.pob_amount = parseFloat(info.pob_amount);

    this.ytd_sale = parseFloat(info.ytd_sale);

    this.lastmonthsale = parseFloat(info.lastmonthsale);

    this.lasttolastmonthsale = parseFloat(info.lasttolastmonthsale);

    this.last_year_same_month = parseFloat(info.last_year_same_month);

    this.ytd_target = parseFloat(info.ytd_target);
    this.target = parseFloat(info.target);
  }
}
