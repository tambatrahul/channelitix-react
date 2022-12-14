import {Model} from "../model";

export class UOM extends Model {

    name: string;
    unit_price: number;
    mrp: number;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.unit_price = info.unit_price;
        this.mrp = info.mrp;
    }
}
