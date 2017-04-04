import {Model} from "../model";
import {CustomerType} from "./customer_type";
import {Grade} from "./grade";
import {Address} from "cluster";
import {Brick} from "../territory/brick";
import {Territory} from "../territory/territory";

export class Customer extends Model {

    firm_name: string;
    owner_name: string;
    email: string;
    mobile: string;
    customer_type_id: number;
    customer_type: CustomerType;
    grade_id: number;
    grade: Grade;
    status: string;
    total_customers: number = 0;
    hq_brick_id: number;
    hq_territory_id: number;
    hq_headquarter_id: number;
    hq_area_id: number;
    hq_region_id: number;
    address: Address;

    brick: Brick;
    territory: Territory;


    constructor(info: any) {
        super(info.id);
        this.firm_name = info.firm_name;
        this.owner_name = info.owner_name;
        this.mobile = info.mobile;
        this.email = info.email;
        this.customer_type = info.customer_type;
        this.customer_type_id = info.customer_type_id;
        this.grade_id = info.grade_id;
        this.grade = info.grade;
        this.status = info.status;
        this.total_customers = info.total_customers;
        this.hq_brick_id = info.hq_brick_id;
        this.hq_territory_id = info.hq_territory_id;
        this.hq_headquarter_id = info.hq_headquarter_id;
        this.hq_area_id = info.hq_area_id;
        this.hq_region_id = info.hq_region_id;
        this.address = info.address;

        // add brick
        if (info.brick)
            this.brick = new Brick(info.brick);

        // add territory
        if (info.territory)
            this.territory = new Territory(info.territory);
    }
}
