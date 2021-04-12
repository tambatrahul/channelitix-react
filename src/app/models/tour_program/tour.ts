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
    working_with_ids: number;
    working_with_users: string;

    // for internal use only
    day: number;
    tours: Tour[] = [];
    isSunday: boolean = false;
    isHoliday: boolean = false;
    tour_count: number;
    tour_day: number;
    t_count: number = 0;

    tour_plan: string;

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
        if (info.tour_count)
            this.tour_count = parseInt(info.tour_count);
        this.user = info.user;
        this.tour_day = info.tour_day;
        this.working_with = info.working_with;
        if (info.tours)
            this.tours = info.tours;

        if (info.tour_plan)
            this.tour_plan = info.tour_plan;

       if (info.working_with_ids)
        this.working_with_ids = parseInt(info.working_with_ids);

        if (info.working_with_users)
            this.working_with_users = info.working_with_users;
    }
}
