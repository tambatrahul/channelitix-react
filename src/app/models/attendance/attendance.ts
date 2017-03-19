import {Model} from "../model";
import {WorkType} from "./work_type";
import {LeaveType} from "./leave_type";
import {User} from "../user/user";
import * as moment from "moment";

export class Attendance extends Model {

  date: string;
  status: string;
  work_type_id: number;
  work_type: WorkType;
  leave_type_id: number;
  leave_type: LeaveType;
  created_by: number;
  creator: User;
  working_with_id: number;

  // for internal use only
  isSunday: boolean = false;
  isHoliday: boolean = false;
  day: number;

  constructor(info: any) {
    super(info.id);
    this.date = info.date;
    this.status = info.status;
    this.work_type = info.work_type;
    this.leave_type = info.leave_type;
    this.created_by = info.created_by;
    this.creator = info.creator;
    this.day = info.day;
    this.work_type_id = info.working_with_id;
    this.leave_type_id = info.leave_type_id;
    this.working_with_id = info.working_with_id;
  }
}
