import {Model} from "../model";
import {Customer} from "../customer/customer";
import {Product} from "../order/product";
import {UOM} from "../order/uom";

export class SecondarySale extends Model {

  month: number;
  year: number;
  customer_id: number;
  product_id: number;
  hq_headquarter_id: number;
  customer_count: number = 0;
  total_customers: number = 0;
  uom_id: number;
  customer: Customer;
  product: Product;
  uom: UOM;
  primary_qty: number = 0;
  primary_sale: number = 0;
  opening: number;
  adjustment: number;
  secondary_sale: number = 0;
  secondary_amount: number = 0;
  closing_amount_hq: number = 0;
  closing: number;
  unit_price: number;

  // for internal user only
  total_amount: number = 0;
  brand_id: number = 0;


  get closing_qty(): number {
    return this.primary_qty + this.adjustment + this.opening - this.secondary_sale;
  }

  get closing_amount(): number {
    return this.closing_qty * this.unit_price;
  }

  // for internal use
  sum_secondary_sale: number = 0;

  constructor(info: any) {
    super(info.id);

    if (info.month)
      this.month = parseInt(info.month);

    this.year = info.year;
    this.customer_id = info.customer_id;
    this.product_id = info.product_id;
    this.uom_id = info.uom_id;

    if (info.sum_secondary_sale)
      this.sum_secondary_sale = parseFloat(info.sum_secondary_sale);

    if (info.opening)
      this.opening = parseFloat(info.opening);
    else
      this.opening = 0;

    if (info.adjustment)
      this.adjustment = parseFloat(info.adjustment);
    else
      this.adjustment = 0;

    if (info.secondary_sale)
      this.secondary_sale = parseFloat(info.secondary_sale);
    else
      this.secondary_sale = 0;

    if (info.secondary_amount)
      this.secondary_amount = parseFloat(info.secondary_amount);
    else
      this.secondary_amount = 0;

    if (info.closing_amount_hq)
      this.closing_amount_hq = parseFloat(info.closing_amount_hq);
    else
      this.closing_amount_hq = 0;

    if (info.closing)
      this.closing = parseFloat(info.closing);
    else
      this.closing = 0;

    if (info.unit_price)
      this.unit_price = parseFloat(info.unit_price);

    if (info.customer)
      this.customer = new Customer(info.customer);

    if (info.product)
      this.product = new Product(info.product);

    if (info.uom)
      this.uom = new UOM(info.uom);

    if (info.hq_headquarter_id)
      this.hq_headquarter_id = parseInt(info.hq_headquarter_id);

    if (info.customer_count)
      this.customer_count = parseInt(info.customer_count);

    if (info.brand_id)
      this.brand_id = parseInt(info.brand_id);

    if (info.total_amount)
      this.total_amount = parseFloat(info.total_amount);

    if (info.primary_qty)
      this.primary_qty = parseFloat(info.primary_qty);

    if (info.primary_sale)
      this.primary_sale = parseFloat(info.primary_sale);
  }
}
