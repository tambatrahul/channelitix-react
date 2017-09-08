import {Model} from "../model";

export class InputAnswer extends Model {

    input_id: number;
    input: {};
    value: number = 0;
    total_value: number = 0;

    constructor(info: any) {
        super(info.id);
        this.input_id = info.input_id;
        this.input = info.input;
        if (info.value)
            this.value = parseInt(info.value);

        if (info.total_value)
            this.value = parseInt(info.total_value);
    }
}
