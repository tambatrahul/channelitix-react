import {Model} from "../model";
import {Grade} from "./grade";
import {Brick} from "../territory/brick";
import {Territory} from "../territory/territory";
import {Headquarter} from "../territory/headquarter";
import {Area} from "../territory/area";
import {Region} from "../territory/region";

export class Stp extends Model {

    customer_count: number = 0;
    hq_brick_id: number;
    hq_territory_id: number;
    hq_headquarter_id: number;
    hq_area_id: number;
    hq_region_id: number;
    grade_id: number;

    hq_brick: Brick;
    hq_territory: Territory;
    hq_headquarter: Headquarter;
    hq_area: Area;
    hq_region: Region;
    grade: Grade;

    constructor(info: any) {
        super(info.id);
        this.hq_brick_id = info.hq_brick_id;
        this.hq_territory_id = info.hq_territory_id;
        this.hq_headquarter_id = info.hq_headquarter_id;
        this.hq_area_id = info.hq_area_id;
        this.hq_region_id = info.hq_region_id;
        if (info.customer_count)
            this.customer_count = parseInt(info.customer_count);
        this.grade_id = info.grade_id;

        if (info.hq_brick)
            this.hq_brick = new Brick(info.hq_brick);

        if (info.hq_territory)
            this.hq_territory = new Territory(info.hq_territory);

        if (info.hq_headquarter)
            this.hq_headquarter = new Headquarter(info.hq_headquarter);

        if (info.hq_area)
            this.hq_area = new Area(info.hq_area);

        if (info.hq_region)
            this.hq_region = new Region(info.hq_region);

        this.grade = info.grade;
    }
}
