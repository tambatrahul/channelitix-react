import {Model} from "../model";
import {Product} from "../order/product";
import {Customer} from "../customer/customer";


export class InvoiceDetail extends Model {

    product: Product;
    total_qty: number = 0;
    total_net_amount: number = 0;
    customer: Customer;

    constructor(info: any) {
        super(info.id);
        this.total_qty = info.total_qty;
        this.total_net_amount = info.total_net_amount;

        if (info.product)
            this.product = new Product(info.product);

        if (info.customer)
            this.customer = new Customer(info.customer);
    }
}
