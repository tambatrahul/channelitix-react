import {Model} from "./model";

export class SalesPlanningDetail extends Model {

  avg_primary_previous_year: number = 0;
  previous_month_secondary: number = 0;
  opening_stock: number = 0;
  primary_plan: number = 0;
  secondary_plan: number = 0;
  customer_id: number = 0;
  brand_id: number = 0;

  constructor(info: any) {
    super(info.id);

    if (info.avg_primary_previous_year)
      this.avg_primary_previous_year = parseInt(info.avg_primary_previous_year);

    if (info.previous_month_secondary)
      this.previous_month_secondary = parseInt(info.previous_month_secondary);

    if (info.opening_stock)
      this.opening_stock = parseInt(info.opening_stock);

    if (info.primary_plan)
      this.primary_plan = parseInt(info.primary_plan);

    if (info.secondary_plan)
      this.secondary_plan = parseInt(info.secondary_plan);

    this.customer_id = info.customer_id;
    this.brand_id = info.brand_id;
  }
}
