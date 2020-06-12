import {PrimarySale} from "../sale/primary_sale";
import {Target} from "./target";
import {SecondarySale} from "../sale/secondary_sale";
import {Product} from "../order/product";
import {Order} from "../order/order";


export class Performance {

  // target fields
  targets: Target[];
  primary_sales: PrimarySale[];
  secondary_sales: SecondarySale[];
  secondary_total_sales: SecondarySale[];
  last_year_this_month_secondary_sales: SecondarySale[];
  orders: Order[];
  till_month_targets: Target[];
  till_month_sales: PrimarySale[];

  products: Product[];

  constructor(info: any) {
    if (info.targets)
      this.targets = info.targets.map(tar => new Target(tar));

    if (info.primary_sales)
      this.primary_sales = info.primary_sales.map(tar => new PrimarySale(tar));

    if (info.secondary_sales) {
      this.secondary_sales = info.secondary_sales.map(tar => new SecondarySale(tar));
    }
    if (info.secondary_total_sales) {
      this.secondary_total_sales = info.secondary_total_sales.map(tar => new SecondarySale(tar));
    }

    if (info.last_year_this_month_secondary_sales) {
      this.last_year_this_month_secondary_sales = info.last_year_this_month_secondary_sales.map(tar => new SecondarySale(tar));
    }

    if (info.products)
      this.products = info.products.map(pro => new Product(pro));

    if (info.orders)
      this.orders = info.orders.map(ord => new Order(ord));

    if (info.till_month_sales)
      this.till_month_sales = info.till_month_sales.map(sale => new PrimarySale(sale));


    if (info.till_month_targets)
      this.till_month_targets = info.till_month_targets.map(tr => new Target(tr));
  }
}
