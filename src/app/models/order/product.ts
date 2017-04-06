import {Model} from "../model";
import {UOM} from "./uom";


export class Product extends Model {

    name: string;
    uoms: UOM[] = [];
    code: string;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.code = info.code;
        if (info.uoms) {
            for (let u of info.uoms) {
                this.uoms.push(new UOM(u));
            }
        }
    }
}
