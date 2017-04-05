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
    opening: number;
    adjustment: number;
    secondary_sale: number;
    closing: number;
    unit_price: number;

    get closing_qty(): number {
        return this.adjustment + this.opening - this.secondary_sale;
    }

    get closing_amount(): number {
        return this.closing_qty * this.unit_price;
    }

    // for internal use
    sum_secondary_sale: number;

    constructor(info: any) {
        super(info.id);
        this.month = info.month;
        this.year = info.year;
        this.customer_id = info.customer_id;
        this.product_id = info.product_id;
        this.uom_id = info.uom_id;

        if (info.sum_secondary_sale)
            this.sum_secondary_sale = parseFloat(info.sum_secondary_sale);

        if (info.opening)
            this.opening = parseFloat(info.opening);
        else
            this.opening = 0;

        if (info.adjustment)
            this.adjustment = parseFloat(info.adjustment);
        else
            this.adjustment = 0;

        if (info.secondary_sale)
            this.secondary_sale = parseFloat(info.secondary_sale);
        else
            this.secondary_sale = 0;

        if (info.closing)
            this.closing = parseFloat(info.closing);
        else
            this.closing = 0;

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
