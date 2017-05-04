import {Model} from "../model";
import {Product} from "../order/product";
import {Customer} from "../customer/customer";


export class Target extends Model {

    product_id: number;
    product: Product;
    total_target: number = 0;
    total_net_amount: number = 0;
    month: number;

    constructor(info: any) {
        super(info.id);
        this.month = info.month;
        this.product_id = info.product_id;

        if (info.total_target)
            this.total_target = parseFloat(info.total_target);

        if (info.total_net_amount)
            this.total_net_amount = parseFloat(info.total_net_amount);
    }
}
