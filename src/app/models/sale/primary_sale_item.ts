import {Model} from "../model";
import {Product} from "../order/product";
import {UOM} from "../order/uom";

export class PrimarySaleItem extends Model {

    product_id: number;
    uom_id: number;
    product: Product;
    uom: UOM;
    net_amt: number;
    qty: number;
    lr_no: string;
    lr_date: string;
    batch_no: string;

    constructor(info: any) {
        super(info.id);
        this.product_id = info.product_id;
        this.uom_id = info.uom_id;
        this.uom = info.uom;
        this.lr_no = info.lr_no;
        this.lr_date = info.lr_date;
        this.batch_no = info.batch_no;

        if (info.net_amt)
            this.net_amt = parseFloat(info.net_amt);

        if (info.product)
            this.product = new Product(info.product);

        if (info.qty)
            this.qty = parseInt(info.qty)
    }
}
