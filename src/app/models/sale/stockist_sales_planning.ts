import {Model} from "../model";

export class StockistSalesPlanning extends Model {

  customer_code: number;
  plan_value: number;
  month_year: number;
  customer_id: number;
  created_by: number;
  updated_by: number;

  constructor(info: any) {
    super(info.id);
    this.customer_code = parseFloat(info.customer_code);
    this.plan_value = parseFloat(info.plan_value);
    this.month_year = parseFloat(info.month_year);
    this.customer_id = parseFloat(info.customer_id);
    this.created_by = parseFloat(info.created_by);
    this.updated_by = parseFloat(info.updated_by);
  }
}
