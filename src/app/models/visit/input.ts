import {Model} from "../model";

export class Input extends Model {

    name: string;
    quantity: number = 0;
    status: boolean;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.quantity = info.quantity;

        this.status = info.status == 'active';
    }
}
