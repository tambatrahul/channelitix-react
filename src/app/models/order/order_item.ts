import {Model} from "../model";
import {User} from "../user/user";
import {Product} from "./product";
import {UOM} from "./uom";

export class OrderItem extends Model {

    product_id: number;
    product: Product;
    unit_price: number;
    uom_id: number;
    uom: UOM;
    quantity: number = 0;

    constructor(info: any) {
        super(info.id);
        this.unit_price = info.unit_price;
        this.uom_id = info.uom_id;
        this.product_id = info.product_id;

        if (info.unit_price)
            this.unit_price = parseFloat(info.unit_price);

        if (info.quantity)
            this.quantity = parseFloat(info.quantity);

        if (info.product)
            this.product = new Product(info.product);

        if (info.uom)
            this.uom = new UOM(info.uom);
    }
}
