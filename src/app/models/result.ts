import {Attendance} from "./attendance/attendance";
import {User} from "./user/user";
import {Customer} from "./customer/customer";
import {CustomerType} from "./customer/customer_type";

export class Result {

  attendances: Attendance[];

  users: User[];
  children: User[];

  customers: Customer[];
  customer_types: CustomerType[];

  recordsTotal: number;
  recordsFiltered: number;
}
