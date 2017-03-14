import {Attendance} from "./attendance/attendance";
import {User} from "./user/user";
import {Customer} from "./customer/customer";
import {CustomerType} from "./customer/customer_type";
import {Territory} from "./territory/territory";
import {Area} from "./territory/Area";
import {Headquarter} from "./territory/headquarter";
import {Brick} from "./territory/brick";
import {Region} from "./territory/region";
import {Country} from "./territory/country";
import {Visit} from "./visit/visit";
import {Holiday} from "./holiday";
import {Order} from "./order/order";
import {WorkType} from "./attendance/work_type";
import {LeaveType} from "./attendance/leave_type";
import {Tour} from "./tour_program/tour";
import {Grade} from "./customer/grade";

export class Result {

    // territory arrays
    countries: Country[];
    regions: Region[];
    areas: Area[];
    territories: Territory[];
    headquarters: Headquarter[];
    bricks: Brick[];

    // attendances models
    attendances: Attendance[];
    work_types: WorkType[];
    leave_types: LeaveType[];

    //Visits models
    visits: Visit[];

    //Orders models
    orders: Order[];

    // holidays models
    holidays: Holiday[];

    // tour models
    tours: Tour[];

    // users models
    user: User;
    users: User[];
    manager: User;
    children: User[];

    // customer models
    customers: Customer[];
    customer_types: CustomerType[];
    grades: Grade[];

    // total number
    total: number;
}
