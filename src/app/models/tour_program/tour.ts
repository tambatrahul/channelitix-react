import {Model} from "../model";
import {Territory} from "../territory/territory";
import {Brick} from "../territory/brick";

export class Tour extends Model {

    date: string;
    user_id: number;
    hq_headquarter_id: number;
    hq_territory_id: number;
    hq_brick_id: number;
    hq_territory: Territory;
    hq_brick: Brick;

    // for internal use only
    day: number;
    tours: Tour[] = [];
    isSunday: boolean = false;

    constructor(info: any) {
        super(info.id);
        this.date = info.date;
        this.user_id = info.user_id;
        this.hq_headquarter_id = info.hq_headquarter_id;
        this.hq_territory_id = info.hq_territory_id;
        this.hq_brick_id = info.hq_brick_id;
        this.day = info.day;
        this.isSunday = info.isSunday;
        this.hq_brick = info.hq_brick;
        this.hq_territory = info.hq_territory;
    }
}
