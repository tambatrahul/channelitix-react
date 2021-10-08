import {Brand} from "../order/brand";
import {SubName} from "../order/subname";

export class YearTillMonth {

  // target fields
  month_target: number = 0;
  till_month_target: number = 0;

  // target fields
  skinlite_month_target: number = 0;
  skinlite_till_month_target: number = 0;

  // sales fields
  month_sale: number = 0;
  till_month_sale: number = 0;

  // sales fields
  skinlite_month_sale: number = 0;
  skinlite_till_month_sale: number = 0;

  primary_sales_and_target: number = 0;
  portfolio_names: SubName[];

  month_sale_target: Brand[];

  sub_name: SubName[];

  constructor(info: any) {

    if (info.month_target)
      this.month_target = parseFloat((parseFloat(info.month_target) / 100000).toFixed(0));

    if (info.till_month_target)
      this.till_month_target = parseFloat((parseFloat(info.till_month_target) / 100000).toFixed(0));

    if (info.month_sale)
      this.month_sale = parseFloat((parseFloat(info.month_sale) / 100000).toFixed(0));

    if (info.till_month_sale)
      this.till_month_sale = parseFloat((parseFloat(info.till_month_sale) / 100000).toFixed(0));

    if (info.skinlite_month_target)
      this.skinlite_month_target = parseFloat((parseFloat(info.skinlite_month_target) / 100000).toFixed(0));

    if (info.skinlite_till_month_target)
      this.skinlite_till_month_target = parseFloat((parseFloat(info.skinlite_till_month_target) / 100000).toFixed(0));

    if (info.skinlite_month_sale)
      this.skinlite_month_sale = parseFloat((parseFloat(info.skinlite_month_sale) / 100000).toFixed(0));

    if (info.skinlite_till_month_sale)
      this.skinlite_till_month_sale = parseFloat((parseFloat(info.skinlite_till_month_sale) / 100000).toFixed(0));

    if(info.primary_sales_and_target)
      this.primary_sales_and_target = info.primary_sales_and_target.map(br => new Brand(br));

    if (info.sub_name)
      this.sub_name = info.sub_name.map(br => new SubName(br));

    if (info.portfolio_names)
      this.portfolio_names = info.portfolio_names.map(br => new SubName(br));
  }
}
