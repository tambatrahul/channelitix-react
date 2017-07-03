import {Model} from "../model";
import {CustomerType} from "./customer_type";
import {Grade} from "./grade";
import {Address} from "cluster";
import {Brick} from "../territory/brick";
import {Territory} from "../territory/territory";
import {Input} from "@angular/core";
import {Product} from "../order/product";
import {Headquarter} from "../territory/headquarter";
import {Region} from "../territory/region";
import {Area} from "../territory/area";

export class Customer extends Model {

    firm_name: string;
    owner_name: string;
    code: number;
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
    synergy: boolean;

    visit_days: string;

    hq_brick: Brick;
    hq_territory: Territory;
    hq_headquarter: Headquarter;
    hq_region: Region;
    hq_area: Area;

    // for internal user only
    inputs: Input[];
    products: Product[];
    customer_types: CustomerType[];
    brick_counts: number = 0;
    visit_count: number = 0;
    order_count: number = 0;
    total_pob: number = 0;
    customer_count: number = 0;
    total_primary_sale: number = 0;

    last_year_sale: number = 0;
    last_year_dexona_sale: number = 0;
    last_month_sale:number = 0;
    last_month_dexona_sale:number = 0;
    visit_counts:number = 0;
    sap_primary_sale:number = 0;

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
        if (info.total_customers)
            this.total_customers = parseInt(info.total_customers);
        this.hq_brick_id = info.hq_brick_id;
        this.hq_territory_id = info.hq_territory_id;
        this.hq_headquarter_id = info.hq_headquarter_id;
        this.hq_area_id = info.hq_area_id;
        this.hq_region_id = info.hq_region_id;
        this.address = info.address;
        this.code = info.code;
        this.synergy = info.synergy;
        this.visit_days = info.visit_days;

        // add brick
        if (info.hq_brick)
            this.hq_brick = new Brick(info.hq_brick);

        // add territory
        if (info.hq_territory)
            this.hq_territory = new Territory(info.hq_territory);

        // add headquarter
        if (info.hq_headquarter)
            this.hq_headquarter = new Headquarter(info.hq_headquarter);

        // add area
        if (info.hq_area)
            this.hq_area = new Area(info.hq_area);

        // add region
        if (info.hq_region)
            this.hq_region = new Region(info.hq_region);

        if (info.brick_counts)
            this.brick_counts = parseInt(info.brick_counts);

        // visit count
        if (info.visit_count)
            this.visit_count = parseInt(info.visit_count);

        if (info.last_year_sale)
            this.last_year_sale = parseInt(info.last_year_sale);

        if (info.last_year_dexona_sale)
            this.last_year_dexona_sale = parseInt(info.last_year_dexona_sale);

        if (info.last_month_sale)
            this.last_month_sale = parseInt(info.last_month_sale);

        if (info.last_month_dexona_sale)
            this.last_month_dexona_sale = parseInt(info.last_month_dexona_sale);

        if (info.visit_counts)
            this.visit_counts = parseInt(info.visit_counts);

        if (info.sap_primary_sale)
            this.sap_primary_sale = parseInt(info.sap_primary_sale);
    }
}
