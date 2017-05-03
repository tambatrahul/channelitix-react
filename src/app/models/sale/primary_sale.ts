import {Model} from "../model";
import {Customer} from "../customer/customer";
import {UOM} from "../order/uom";
import {PrimarySaleItem} from "./primary_sale_item";

export class PrimarySale extends Model {

    doc_date: string;
    customer_id: number;
    uom_id: number;
    customer: Customer;
    uom: UOM;
    net_amt: number;

    invoice_details: PrimarySaleItem[] = [];

    // for internal use only
    total_net_amount: number;
    month: number;

    constructor(info: any) {
        super(info.id);
        this.doc_date = info.doc_date;
        this.customer_id = info.customer_id;
        this.uom_id = info.uom_id;
        this.month = info.month;

        if (info.net_amt)
            this.net_amt = parseFloat(info.net_amt);

        if (info.customer)
            this.customer = new Customer(info.customer);

        if (info.uom)
            this.uom = new UOM(info.uom);

        if (info.invoice_details)
            this.invoice_details = info.invoice_details.map(item => new PrimarySaleItem(item));

        if (info.total_net_amount)
            this.total_net_amount = parseFloat(info.total_net_amount);
    }
}
