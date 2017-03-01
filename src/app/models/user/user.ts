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
  auth_token: string;
  role_id: number;

  // for local use only
  attendances = [];
  visits = [];
  orders = [];

  constructor(info: any) {
    super(info.id);
    this.full_name = info.full_name;
    this.mobile = info.mobile;
    this.username = info.username;
    this.password = info.password;
    this.joining_date = info.joining_date;
    this.leaving_date = info.leaving_date;
    this.status = info.status;
    this.auth_token = info.auth_token;
    this.role_id = info.role_id;
  }

  /**
   * if role is less then 3
   * @returns {boolean}
   */
  get isLastChild(): boolean {
    return this.role_id < 4;
  }
}
