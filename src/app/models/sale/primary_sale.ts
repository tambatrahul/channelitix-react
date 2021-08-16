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
  brand_id: number;
  brand_category: string;
  customer: Customer;
  uom: UOM;
  net_amt: number;
  stockist_code: number;
  invoice_no: number;
  prd_code: string;
  customer_count: number;
  product: Product;

  invoice_details: PrimarySaleItem[] = [];

  old_date_value: string;

  brand_name: string;
  brand_sub_name: string;

  // for internal use only
  total_net_amount: number;
  total_net_amt: number;
  total_qty: number;
  hq_headquarter_id: number;
  hq_area_id: number;
  hq_region_id: number;
  month: number;
  year: number;
  upto_7th_sale: number;
  upto_14th_sale: number;
  upto_21th_sale: number;
  upto_28th_sale: number;
  sub_name: string;


  constructor(info: any) {
    super(info.id);
    this.doc_date = info.doc_date;
    this.customer_id = info.customer_id;
    this.uom_id = info.uom_id;
    this.sub_name = info.sub_name;

    if (info.month)
      this.month = parseInt(info.month);

    if (info.year)
      this.year = parseInt(info.year);

    if (info.brand_category)
      this.brand_category = info.brand_category;

    this.stockist_code = info.stockist_code;

    this.invoice_no = info.doc_no;

    if (info.prd_code)
      this.prd_code = info.prd_code;

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

    if (info.total_net_amt)
      this.total_net_amt = parseFloat(info.total_net_amt);

    if (info.hq_headquarter_id)
      this.hq_headquarter_id = parseInt(info.hq_headquarter_id);

    if (info.hq_area_id)
      this.hq_area_id = parseInt(info.hq_area_id);

    if (info.hq_region_id)
      this.hq_region_id = parseInt(info.hq_region_id);

    if (info.product_id)
      this.product_id = parseInt(info.product_id);

    if (info.brand_id)
      this.brand_id = parseInt(info.brand_id);

    if (info.product)
      this.product = new Product(info.product);

    if (info.total_qty)
      this.total_qty = parseFloat(info.total_qty);

    if (info.upto_7th_sale)
      this.upto_7th_sale = parseFloat(info.upto_7th_sale);

    if (info.upto_14th_sale)
      this.upto_14th_sale = parseFloat(info.upto_14th_sale);

    if (info.upto_21th_sale)
      this.upto_21th_sale = parseFloat(info.upto_21th_sale);

    if (info.upto_28th_sale)
      this.upto_28th_sale = parseFloat(info.upto_28th_sale);

    if (info.customer_count)
      this.customer_count = parseInt(info.customer_count);

    if (info.old_date_value)
      this.old_date_value = info.old_date_value;

    if (info.brand_sub_name)
      this.brand_sub_name = info.brand_sub_name;

  }
}
