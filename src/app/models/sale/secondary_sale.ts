import {Model} from "../model";
import {Customer} from "../customer/customer";
import {Product} from "../order/product";
import {UOM} from "../order/uom";

export class SecondarySale extends Model {

    month: number;
    year: number;
    customer_id: number;
    product_id: number;
    uom_id: number;
    customer: Customer;
    product: Product;
    uom: UOM;

    constructor(info: any) {
        super(info.id);
        this.month = info.month;
        this.year = info.year;
        this.customer_id = info.customer_id;
        this.product_id = info.product_id;
        this.uom_id = info.uom_id;

        if (info.customer)
            this.customer = new Customer(info.customer);

        if (info.product)
            this.product = new Product(info.product);

        if (info.uom)
            this.uom = new UOM(info.uom);
    }
}
