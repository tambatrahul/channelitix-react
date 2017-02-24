import {Attendance} from "./attendance/attendance";
import {User} from "./user/user";
import {Customer} from "./customer/customer";
import {CustomerType} from "./customer/customer_type";
import {Territory} from "./territory/territory";
import {Area} from "./territory/Area";
import {Headquarter} from "./territory/headquarter";
import {Brick} from "./territory/brick";

export class Result {

    attendances: Attendance[];
    territories: Territory[];
    headquarters: Headquarter[];
    bricks: Brick[];

    areas: Area[];

    users: User[];
    children: User[];

    customers: Customer[];
    customer_types: CustomerType[];

    total: number;

    user: User;
}
