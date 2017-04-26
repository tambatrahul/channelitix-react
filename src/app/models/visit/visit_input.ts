import {Model} from "../model";

export class VisitInput extends Model {

    name: string;
    value: number = 0;

    // for internal use only
    answer_id: number;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.answer_id = info.answer_id;

        if (info.value)
            this.value = parseInt(info.value);
    }
}
