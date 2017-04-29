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

    constructor(info: any) {
        super(info.id);
        this.product_id = info.product_id;
        this.uom_id = info.uom_id;

        if (info.net_amt)
            this.net_amt = parseFloat(info.net_amt);

        if (info.product)
            this.product = new Product(info.product);

        if (info.uom)
            this.uom = new UOM(info.uom);

        if (info.qty)
            this.qty = parseInt(info.qty)
    }
}
