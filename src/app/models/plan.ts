import {Model} from "./model";

export class Plan extends Model {

  avg_primary_previous_year: number = 0;
  previous_month_secondary: number = 0;
  opening_stock: number = 0;
  primary_plan: number = 0;
  secondary_plan: number = 0;

  constructor(info: any) {
    super(info.id);
    this.avg_primary_previous_year = parseInt(info.avg_primary_previous_year);
    this.previous_month_secondary = parseInt(info.previous_month_secondary);
    this.opening_stock = parseInt(info.opening_stock);
    this.primary_plan = parseInt(info.primary_plan);
    this.secondary_plan = parseInt(info.secondary_plan);
  }
}
