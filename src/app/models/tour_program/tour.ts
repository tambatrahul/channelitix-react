import {Model} from "../model";
import {Territory} from "../territory/territory";
import {Brick} from "../territory/brick";
import {User} from "../user/user";

export class Tour extends Model {

    date: string;
    type: string;
    user_id: number;
    hq_headquarter_id: number;
    hq_territory_id: number;
    hq_brick_id: number;
    hq_territory: Territory;
    hq_brick: Brick;
    user: User;
    working_with: User;

    // for internal use only
    day: number;
    tours: Tour[] = [];
    isSunday: boolean = false;
    isHoliday: boolean = false;
    tour_count: number;
    tour_day: number;

    constructor(info: any) {
        super(info.id);
        this.date = info.date;
        this.type = info.type;
        this.user_id = info.user_id;
        this.hq_headquarter_id = info.hq_headquarter_id;
        this.hq_territory_id = info.hq_territory_id;
        this.hq_brick_id = info.hq_brick_id;
        this.day = info.day;
        this.isSunday = info.isSunday;
        this.isHoliday = info.isHoliday;
        this.hq_brick = info.hq_brick;
        this.hq_territory = info.hq_territory;
        this.tour_count = info.tour_count;
        this.user = info.user;
        this.tour_day = info.tour_day;
        this.working_with = info.working_with;
        if (info.tours)
            this.tours = info.tours;
    }
}
