import {Component} from "@angular/core";
import {AttendanceService} from "../../services/attendance.service";
import {Attendance} from "../../models/attendance/attendance";
import {User} from "../../models/user/user";
import {AppConstants} from "../../app.constants";
import * as moment from "moment";

@Component({
  selector: 'app-root',
  templateUrl: 'templates/index.component.html',
  styleUrls: ['templates/less/index.component.less']
})
export class AttendanceComponent {

  /**
   * loading flag
   * @type {boolean}
   */
  private loading: boolean = false;

  /**
   * Role id
   * @type {number}
   */
  public role_id: number = 3;

  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number = 1;
  public year: number = 2017;

  /**
   * get date range
   *
   * @returns {Array<number>}
   */
  get dates(): Array<number> {
    let dates = [];
    for (let d = 1; d <= moment().month(this.month - 1).year(this.year).endOf('month').date(); d++) {
      dates.push(d);
    }
    return dates;
  }

  /**
   * users
   *
   * @type {{}}
   */
  public users: User[] = [];

  /**
   * Attendance Component Constructor
   *
   */
  constructor(private attendanceService: AttendanceService) {
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    this.fetchAttendances();
  }

  /**
   * Adding attendance to skeleton
   *
   * @param users
   * @param attendances
   */
  addAttendanceToSkeleton(users: User[], attendances: Attendance[]) {
    let data_skeleton = {};

    // prepare attendance skeleton
    for (let att of attendances) {
      // add user if not present
      if (!data_skeleton.hasOwnProperty(att.created_by)) {
        data_skeleton[att.created_by] = AppConstants.prepareMonthSkeleton(this.month, this.year);
      }

      // set attendance details
      data_skeleton[att.created_by][moment(att.date, "YYYY-MM-DD").date() - 1] = att;
    }

    // add skeleton to user
    for (let user of users) {
      if (data_skeleton.hasOwnProperty(user.id))
        user.attendances = data_skeleton[user.id];
      else
        user.attendances = AppConstants.prepareMonthSkeleton(this.month, this.year);
    }



    this.users = users;
  }

  /**
   * load attendance for children of logged in user
   */
  fetchAttendances() {
    this.loading = true;
    this.attendanceService.forChildren(this.month, this.year, this.role_id).subscribe(
      response => {
        this.loading = false;
        this.addAttendanceToSkeleton(response.children, response.attendances);
      },
      err => {
        this.loading = false;
      }
    );
  }


}
