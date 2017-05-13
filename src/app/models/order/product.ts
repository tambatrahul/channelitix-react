import {Model} from "../model";
import {UOM} from "./uom";
import {InvoiceDetail} from "../SAP/invoice_detail";


export class Product extends Model {

    name: string;
    short_name: string;
    uoms: UOM[] = [];
    code: string;
    synergy: number = 0;

    // for internal use only
    target: number = 0;
    performance: number = 0;
    invoice_detail: InvoiceDetail;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.code = info.code;
        this.short_name = this.name.replace(/ *\([^)]*\) */g, "");
        this.synergy = info.synergy;

        if (info.uoms) {
            for (let u of info.uoms) {
                this.uoms.push(new UOM(u));
            }
        }

        if (info.invoice_detail)
            this.invoice_detail = new InvoiceDetail(info.invoice_detail);

        if (info.target)
            this.target = parseFloat(info.target);

        if (info.performance)
            this.performance = parseFloat(info.performance);
    }
}
