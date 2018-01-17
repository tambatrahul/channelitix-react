import {Model} from "../model";
import {Customer} from "../customer/customer";
import {UOM} from "../order/uom";
import {PrimarySaleItem} from "./primary_sale_item";
import {Product} from "../order/product";

export class PrimarySale extends Model {

  doc_date: string;
  customer_id: number;
  uom_id: number;
  product_id: number;
  customer: Customer;
  uom: UOM;
  net_amt: number;
  stockist_code: number;
  prd_code: number;
  product: Product;

  invoice_details: PrimarySaleItem[] = [];

  // for internal use only
  total_net_amount: number;
  total_qty: number;
  hq_headquarter_id: number;
  hq_area_id: number;
  hq_region_id: number;
  month: number;
  upto_9th_sale: number;
  upto_18th_sale: number;
  upto_24th_sale: number;
  upto_28th_sale: number;

  constructor(info: any) {
    super(info.id);
    this.doc_date = info.doc_date;
    this.customer_id = info.customer_id;
    this.uom_id = info.uom_id;

    if (info.month)
      this.month = parseInt(info.month);

    this.stockist_code = info.stockist_code;

    if(info.prd_code)
      this.prd_code = parseFloat(info.prd_code);

    if (info.net_amt)
      this.net_amt = parseFloat(info.net_amt);

    if (info.customer)
      this.customer = new Customer(info.customer);

    if (info.uom)
      this.uom = new UOM(info.uom);

    if (info.invoice_details)
      this.invoice_details = info.invoice_details.filter(item => item.product).map(item => new PrimarySaleItem(item));

    if (info.total_net_amount)
      this.total_net_amount = parseFloat(info.total_net_amount);

    if (info.hq_headquarter_id)
      this.hq_headquarter_id = parseInt(info.hq_headquarter_id);

    if (info.hq_area_id)
      this.hq_area_id = parseInt(info.hq_area_id);

    if (info.hq_region_id)
      this.hq_region_id = parseInt(info.hq_region_id);

    if (info.product_id)
      this.product_id = parseInt(info.product_id);

    if (info.product)
      this.product = new Product(info.product);

    if (info.total_qty)
      this.total_qty = parseFloat(info.total_qty);

    if (info.upto_9th_sale)
      this.upto_9th_sale = parseFloat(info.upto_9th_sale);

    if (info.upto_18th_sale)
      this.upto_18th_sale = parseFloat(info.upto_18th_sale);

    if (info.upto_24th_sale)
      this.upto_24th_sale = parseFloat(info.upto_24th_sale);

    if (info.upto_28th_sale)
      this.upto_28th_sale = parseFloat(info.upto_28th_sale);
  }
}
