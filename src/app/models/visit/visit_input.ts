import {Model} from "../model";

export class VisitInput extends Model {

    name: string;
    value: number;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.value = info.value;
    }
}
