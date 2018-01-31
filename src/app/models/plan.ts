import {Model} from "./model";

export class SalesPlanningDetail extends Model {

  avg_primary_previous_year: number = 0;
  previous_month_secondary: number = 0;
  opening_stock: number = 0;
  primary_sale: number = 0;
  secondary_sale: number = 0;
  customer_id: number = 0;
  brand_id: number = 0;
  pob: number = 0;

  constructor(info: any) {
    super(info.id);

    if (info.avg_primary_previous_year)
      this.avg_primary_previous_year = parseInt(info.avg_primary_previous_year);

    if (info.previous_month_secondary)
      this.previous_month_secondary = parseInt(info.previous_month_secondary);

    if (info.opening_stock)
      this.opening_stock = parseInt(info.opening_stock);

    if (info.primary_sale)
      this.primary_sale = parseInt(info.primary_sale);

    if (info.secondary_sale)
      this.secondary_sale = parseInt(info.secondary_sale);

    this.customer_id = info.customer_id;
    this.brand_id = info.brand_id;
  }
}
