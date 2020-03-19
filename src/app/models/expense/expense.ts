import {Model} from '../model';
import {Headquarter} from '../territory/headquarter';
import {Region} from '../territory/region';
import {Area} from '../territory/area';

export class Expense extends Model {

  date: string;
  status: string;
  manager_status: string;
  daily_allowance: number = 0;
  daily_allowance_adjustment_amount: number = 0;
  travel_allowance: number = 0;
  other_expense: number = 0;
  total_km_travelled: number = 0;
  user_id: number = 0;
  work_type: string;
  checked: boolean = false;
  no_of_working_days: number = 0;

  hq_headquarter_id: number = 0;
  hq_area_id: number = 0;
  hq_region_id: number = 0;

  hq_headquarter: Headquarter;
  hq_region: Region;
  hq_area: Area;

  constructor(info: any) {
    super(info.id);
    this.date = info.date;
    this.status = info.status;
    this.manager_status = info.manager_status;
    this.daily_allowance = parseFloat(info.daily_allowance);
    this.daily_allowance_adjustment_amount = parseFloat(info.daily_allowance_adjustment_amount);
    this.travel_allowance = parseFloat(info.travel_allowance);
    this.total_km_travelled = info.total_km_travelled;
    this.user_id = info.user_id;

    if (info.hq_headquarter) {
      this.hq_headquarter = info.hq_headquarter;
    }

    if (info.hq_region) {
      this.hq_region = info.hq_region;
    }

    if (info.hq_area) {
      this.hq_area = info.hq_area;
    }

    if (info.other_expense) {
      this.other_expense = info.other_expense;
    }

    if (info.hq_headquarter_id) {
      this.hq_headquarter_id = parseInt(info.hq_headquarter_id);
    }

    if (info.hq_area_id) {
      this.hq_area_id = parseInt(info.hq_area_id);
    }

    if (info.hq_region_id) {
      this.hq_region_id = parseInt(info.hq_region_id);
    }

  }

  /**
   * Total Expense
   */
  get totalExpense(){
    let total: number = 0;
    total = this.daily_allowance + this.travel_allowance + this.daily_allowance_adjustment_amount;
    return total;
  }
}
