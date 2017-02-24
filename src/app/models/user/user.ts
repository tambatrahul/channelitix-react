import {Model} from "../model";
import {Attendance} from "../attendance/attendance";

export class User extends Model {

  full_name: string;
  mobile: string;
  username: string;
  password: string;
  joining_date: string;
  leaving_date: string;
  status: string;

  // for local use only
  attendances = [];

  constructor(info: any) {
    super(info.id);
    this.full_name = info.full_name;
    this.mobile = info.mobile;
    this.username = info.username;
    this.password = info.password;
    this.joining_date = info.joining_date;
    this.leaving_date = info.leaving_date;
    this.status = info.status;
  }
}
