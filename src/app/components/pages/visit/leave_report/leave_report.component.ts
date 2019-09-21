import {Component} from "@angular/core";
import * as moment from "moment";
import {VisitService} from "../../../../services/visit.service";
import {AuthService} from "../../../../services/AuthService";
import {AttendanceService} from "../../../../services/attendance.service";
import {ListComponent} from "../../../base/list.component";
import {User} from "../../../../models/user/user";
import {Region} from "../../../../models/territory/region";
import {Attendance} from "../../../../models/attendance/attendance";
import {environment} from "../../../../../environments/environment";

declare let jQuery: any;
declare let d3: any;
declare let swal: any;

@Component({
  templateUrl: 'leave_report.component.html',
  styleUrls: ['leave_report.component.less']
})
export class LeaveReportComponent extends ListComponent {

  excel_loaded: boolean = false;
  btn_loading: boolean = false;
  /**
   * year and month for calendar
   *
   * @type {number}
   */
  public month: number;
  public year: number;

  /**
   * zone identifier
   */
  zone_id: number = 0;

  /**
   * region identifier
   */
  public region_id: number = 0;

  /**
   * area identifier
   */
  public area_id: number = 0;

  /**
   * users
   *
   * @type {{}}
   */
  public managers: User[] = [];

  /**
   * Leave Report Component Constructor
   */
  constructor(private attendanceService: AttendanceService, public _service: AuthService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    // get current month and year
    this.month = moment().month();
    this.year = moment().year();
    super.ngOnInit();
    if(this._service.user.role_str == 'COUNTRY_MNG')
      this.zone_id = 1;
  }

  /**
   * fetch server data for visits
   */
  protected fetch() {
    if (this.month && this.year) {
      this.loading = true;
      this.attendanceService.leave_report(this.month + 1, this.year, this.region_id, this.zone_id).subscribe(
        response => {

          // get users
          let users = response.users.map(user => new User(user));

          // get attendances
          let attendances = response.attendances.map(att => new Attendance(att));

          // prepare data for display
          this.prepareData(users, attendances);

          this.loading = false;
        },
        err => {
          this.loading = false;
        });
    }
  }

  /**
   * Prepare Data
   * @param users
   * @param attendances
   */
  prepareData(users: User[], attendances: Attendance[]) {
    let data_skeleton = {};
    let managers: User[] = [];
    let zone_managers: User[] = [];

    // get skeleton
    for (let user of users) {
      data_skeleton[user.id] = [];
    }

    // Prepare Attendances Data
    for (let att of attendances) {
      if (data_skeleton.hasOwnProperty(att.created_by)) {
        if (att.leave_type_id == 1)
          data_skeleton[att.created_by]['casual_leave'] = att.leave_count;

        if (att.leave_type_id == 2)
          data_skeleton[att.created_by]['sick_leave'] = att.leave_count;

        if (att.leave_type_id == 3)
          data_skeleton[att.created_by]['privilege_leave'] = att.leave_count;
      }
    }

    // add skeleton to user
    for (let user of users) {
      if (data_skeleton.hasOwnProperty(user.id)) {
        user.casual_leave = data_skeleton[user.id]['casual_leave'] ? data_skeleton[user.id]['casual_leave'] : 0;
        user.sick_leave = data_skeleton[user.id]['sick_leave'] ? data_skeleton[user.id]['sick_leave'] : 0;
        user.privilege_leave = data_skeleton[user.id]['privilege_leave'] ? data_skeleton[user.id]['privilege_leave'] : 0;
      }

      // separate csm and zsm
      if (user.role_str == this.ROLE_CSM) {
        managers.push(user);
      } else if (user.role_str == this.ROLE_RSM) {
        zone_managers.push(user);
      }
    }

    // if user is zone manager add it to list
    if (this._service.user.role_str == this.ROLE_RSM) {
      this._service.user.children = [];
      zone_managers.push(this._service.user)
    }

    // if user is zone manager add it to list
    if (this._service.user.role_str == this.ROLE_CSM) {
      this._service.user.children = [];
      managers.push(this._service.user)
    }

    // add children to managers
    for (let u of users) {
      for (let m of managers) {
        if (u.manager_id == m.id) {
          m.children.push(u);
        }
      }
    }

    // add to zone manager
    for (let z of zone_managers) {
      for (let m of managers) {
        if (m.manager_id == z.id) {
          z.children.push(m);
        }
      }
    }

    // depending on list show view
    if (zone_managers.length > 0)
      this.managers = zone_managers;
    else
      this.managers = managers;
  }

  /**
   * month and year changed
   *
   * @param date
   */
  monthYearChanged(date) {
    this.month = date.month;
    this.year = date.year;
    this.fetch();
  }

  /**
   * customer type changed
   * @param zone_id
   */
  zoneChanged(zone_id) {
    this.zone_id = zone_id;
    this.fetch();
  }
  /**
   * Download Excel For Stockist POB
   */
  download() {
    this.btn_loading = true;

    this.attendanceService.leave_report_excel_download(this.month + 1, this.year,null,null, this.zone_id).subscribe(
      response => {
        let blob: Blob = response.blob();

        // Doing it this way allows you to name the file
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "leave_report.xls";
        link.click();
        this.btn_loading = false;

      },
      err => {
        this.btn_loading = false;
      }
    );
  }

}
