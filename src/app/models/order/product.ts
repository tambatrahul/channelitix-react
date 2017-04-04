import {Model} from "../model";

export class Product extends Model {

    name: string;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
    }
}
