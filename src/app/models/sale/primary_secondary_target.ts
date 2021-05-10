import {Model} from "../model";

export class PrimarySecondaryTarget extends Model {

  month_year: number;
  target: number;
  net_amt: number;
  sec_sale: number;

  constructor(info: any) {
    super(info.id);

    this.month_year = parseInt(info.month_year);

    this.target = parseFloat(info.target);

    this.net_amt = parseFloat(info.net_amt);

    this.sec_sale = parseFloat(info.sec_sale);
  }
}
