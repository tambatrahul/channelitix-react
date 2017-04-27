import {Model} from "../model";
import {Customer} from "../customer/customer";
import {Product} from "../order/product";
import {UOM} from "../order/uom";

export class PrimarySale extends Model {

    date: string;
    customer_id: number;
    product_id: number;
    uom_id: number;
    customer: Customer;
    product: Product;
    uom: UOM;
    unit_price: number;

    constructor(info: any) {
        super(info.id);
        this.date = info.date;
        this.customer_id = info.customer_id;
        this.product_id = info.product_id;
        this.uom_id = info.uom_id;

        if (info.unit_price)
            this.unit_price = parseFloat(info.unit_price);

        if (info.customer)
            this.customer = new Customer(info.customer);

        if (info.product)
            this.product = new Product(info.product);

        if (info.uom)
            this.uom = new UOM(info.uom);

    }
}
