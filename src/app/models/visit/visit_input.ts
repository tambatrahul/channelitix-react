import {Model} from "../model";

export class VisitInput extends Model {

    name: string;
    value: number = 0;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        if (info.value)
            this.value = parseInt(info.value);
    }
}
