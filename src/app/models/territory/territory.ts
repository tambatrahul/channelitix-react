import {Model} from "../model";
import {Headquarter} from "./headquarter";

export class Territory extends Model {

    name: string;
    hq_headquarter: Headquarter;
    hq_headquarter_id: number;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.hq_headquarter = info.hq_headquarter;
        this.hq_headquarter_id = info.hq_headquarter.id;
    }
}
