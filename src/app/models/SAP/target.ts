import {Model} from "../model";
import {Product} from "../order/product";
import {Headquarter} from "../territory/headquarter";


export class Target extends Model {

    product_id: number;
    product: Product;
    total_target: number = 0;
    target: number = 0;
    total_net_amount: number = 0;
    order_count: number = 0;
    brand_id: number = 0;
    month: number;
    year: number;
    target_month: number;
    hq_headquarter_id: number;
    hq_headquarter: Headquarter;
    sub_name: string;

    brand_name: string;
    brand_sub_name: string;

    constructor(info: any) {
        super(info.id);
        this.product_id = info.product_id;
        this.hq_headquarter_id = info.hq_headquarter_id;
        this.sub_name = info.sub_name;

        if (info.total_target)
            this.total_target = parseFloat(info.total_target);

        if (info.month)
            this.month = parseFloat(info.month);

      if (info.year)
        this.year = parseFloat(info.year);

        if (info.total_net_amount)
            this.total_net_amount = parseFloat(info.total_net_amount);

        if (info.order_count)
            this.order_count = parseFloat(info.order_count);

        if (info.target)
            this.target = parseInt(info.target);

        if (info.brand_id)
            this.brand_id = parseInt(info.brand_id);

        if (info.brand_sub_name)
            this.brand_sub_name = info.brand_sub_name;
    }
}
