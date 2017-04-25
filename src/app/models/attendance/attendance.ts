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
    working_with_ids: Array<number>;
    working_withs: User[];
    no_of_calls: number = 0;
    pob_amount: number = 0;
    reporting_status: string = "open";

    // for internal use only
    isSunday: boolean = false;
    isHoliday: boolean = false;
    isDisabled: boolean = false;
    day: number;
    att_count: number = 0;

    constructor(info: any) {
        super(info.id);
        this.date = info.date;
        this.status = info.status;
        if (info.work_type)
            this.work_type = new WorkType(info.work_type);

        this.leave_type = info.leave_type;
        this.created_by = info.created_by;
        this.creator = info.creator;
        this.day = info.day;
        this.work_type_id = info.working_with_id;
        this.leave_type_id = info.leave_type_id;
        this.working_with_id = info.working_with_id;
        this.reporting_status = info.reporting_status;

        if (info.no_of_calls)
            this.no_of_calls = parseInt(info.no_of_calls);

        if (info.pob_amount)
            this.pob_amount = parseFloat(info.pob_amount);

        if (info.working_withs) {
            let self = this;
            info.working_withs.map(function(user) {
                self.working_with_ids.push(user.id);
            })
        }
    }
}
