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

  // users models
  user: User;
  users: User[];
  children: User[];

  // customer models
  customers: Customer[];
  customer_types: CustomerType[];

  // total number
  total: number;
}
