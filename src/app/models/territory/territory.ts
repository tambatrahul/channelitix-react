import {Model} from "../model";
import {Headquarter} from "./headquarter";

export class Territory extends Model {

    name: string;
    hq_headquarter: Headquarter;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.hq_headquarter = info.hq_headquarter;
    }
}
