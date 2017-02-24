import {Model} from "../model";

export class Area extends Model {

    name: string;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
    }
}
