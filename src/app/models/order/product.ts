import {Model} from "../model";
import {UOM} from "./uom";
import {InvoiceDetail} from "../SAP/invoice_detail";
import {Brand} from "./brand";


export class Product extends Model {

    name: string;
    short_name: string;
    uoms: UOM[] = [];
    code: number;
    synergy: number = 0;

    // for internal use only
    target: number = 0;
    performance: number = 0;
    invoice_detail: InvoiceDetail;
    amount: number = 0;
    primary_sale_amount: number = 0;
    primary_sale: number = 0;
    brand_id: number = 0;

    brands: Brand;


    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.code = info.code;
        this.short_name = this.name.replace(/ *\([^)]*\) */g, "");
        if (info.synergy)
            this.synergy = info.synergy;

        if (info.uoms) {
            for (let u of info.uoms) {
                this.uoms.push(new UOM(u));
            }
        }

        if (info.brands)
            this.brands = new Brand(info.brands);

        if (info.invoice_detail)
            this.invoice_detail = new InvoiceDetail(info.invoice_detail);

        if (info.target)
            this.target = parseFloat(info.target);

        if (info.performance)
            this.performance = parseFloat(info.performance);

        if (info.amount)
            this.amount = parseFloat(info.amount);

        if (info.primary_sale)
            this.primary_sale = parseFloat(info.primary_sale);

        if (info.brand_id)
            this.brand_id = parseInt(info.brand_id);
    }

    get onTarget() {
        if (this.target > 0)
            return this.primary_sale >= this.target;
        else
            return false;
    }
}
