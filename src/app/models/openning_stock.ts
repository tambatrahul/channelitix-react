import {Model} from "./model";

export class OpeningStock extends Model {

    opening_stock: number = 0;
    customer_id: number = 0;
    brand_id: number = 0;

    constructor(info: any) {
        super(info.id);
        this.opening_stock = parseInt(info.opening_stock);
        this.customer_id = parseInt(info.customer_id);
        this.brand_id = parseInt(info.brand_id);
    }
}
