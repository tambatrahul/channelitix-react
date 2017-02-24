import {Component, ViewChild, ElementRef} from "@angular/core";
import {AttendanceService} from "../../../base/services/attendance.service";
import {Attendance} from "../../../models/attendance/attendance";
import {User} from "../../../models/user/user";
import {AppConstants} from "../../../app.constants";
import * as moment from "moment";
declare let jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: 'templates/index.component.html',
  styleUrls: ['templates/less/index.component.less']
})
export class AttendanceComponent {

  /**
   * manager and user Role id
   * @type {number}
   */
  public role_id: number = 0;
  public manager_role_id: number = 0;

  /**
   * manager_id
   */
  public manager_id: number = 0;

  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public year: number;

  /**
   * loading identifier
   */
  @ViewChild('loading_table')
  loading_table: ElementRef;

  /**
   * get date range
   *
   * @returns {Array<number>}
   */
  get dates(): Array<number> {
    let dates = [];
    for (let d = 1; d <= moment().month(this.month).year(this.year).endOf('month').date(); d++) {
      dates.push(d);
    }
    return dates;
  }

  /**
   * get title of table
   * @returns {string}
   */
  get title(): string {
    return moment().year(this.year).month(this.month).format("MMMM, YYYY");
  }

  /**
   * Set loading variable
   * @param loading
   */
  set loading(loading) {
    if (loading)
      jQuery(this.loading_table.nativeElement).mask('loading');
    else
      jQuery(this.loading_table.nativeElement).unmask();
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
    this.month = moment().month();
    this.year = moment().year();
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
    this.attendanceService.forChildren(this.month + 1, this.year, this.role_id, this.manager_id).subscribe(
      response => {
        this.loading = false;
        this.addAttendanceToSkeleton(response.children, response.attendances);
      },
      err => {
        this.loading = false;
      }
    );
  }

  /**
   * month and year changed
   *
   * @param date
   */
  monthYearChanged(date) {
    this.month = date.month;
    this.year = date.year;
    this.fetchAttendances();
  }

  /**
   * when role is changed filter list of attendances
   * @param role_id
   */
  roleChanged(role_id) {
    this.role_id = role_id;
    this.manager_role_id = parseInt(role_id) + 1;
    this.fetchAttendances();
  }

  /**
   * when role is changed filter list of users
   *
   * @param manager_id
   */
  managerChanged(manager_id) {
    this.manager_id = manager_id;
    this.fetchAttendances();
  }
}
