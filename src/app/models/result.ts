import {Attendance} from "./attendance/attendance";
import {User} from "./user/user";

export class Result {

  attendances: Attendance[];

  users: User[];
  children: User[];

  recordsTotal: number;
  recordsFiltered: number;
}
