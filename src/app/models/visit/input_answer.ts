import {Model} from "../model";

export class InputAnswer extends Model {

    input_id: number;
    input: {};
    value: number = 0;

    constructor(info: any) {
        super(info.id);
        this.input_id = info.input_id;
        this.input = info.input;
        if (info.value)
            this.value = parseInt(info.value);
    }
}
