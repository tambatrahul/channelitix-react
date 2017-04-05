import {Model} from "../model";
import {UOM} from "./uom";


export class Product extends Model {

    name: string;
    code: string;
    uoms: UOM[];

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.code = info.code;
        this.uoms = info.uoms;
    }
}
