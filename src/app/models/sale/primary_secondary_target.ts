import {Model} from "../model";

export class PrimarySecondaryTarget extends Model {

  month_year: number;
  total_target: number;
  total_net_amt: number;
  total_secondary_sales: number;

  constructor(info: any) {
    super(info.id);

    this.month_year = parseInt(info.month_year);

    this.total_target = parseFloat(info.total_target);

    this.total_net_amt = parseFloat(info.total_net_amt);

    this.total_secondary_sales = parseFloat(info.total_secondary_sales);
  }
}
