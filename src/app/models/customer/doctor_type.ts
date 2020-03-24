import {Model} from "../model";

export class DoctorType extends Model {

    name: string;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
    }
}
