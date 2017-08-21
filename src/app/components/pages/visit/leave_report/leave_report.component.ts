import {Component} from "@angular/core";
import * as moment from "moment";
import {VisitService} from "../../../../services/visit.service";
import {AuthService} from "../../../../services/AuthService";
import {AttendanceService} from "../../../../services/attendance.service";
import {ListComponent} from "../../../base/list.component";
import {User} from "../../../../models/user/user";
import {Region} from "../../../../models/territory/region";
import {Attendance} from "../../../../models/attendance/attendance";
declare let jQuery: any;
declare let d3: any;
declare let swal: any;

@Component({
  templateUrl: 'leave_report.component.html',
  styleUrls: ['leave_report.component.less']
})
export class LeaveReportComponent extends ListComponent {

  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public year: number;

  /**
   * region
   */
  public region_id: number = 0;

  /**
   * get regions
   *
   * @type {Array}
   */
  regions: Region[] = [];

  /**
   * User Component Constructor
   *
   */
  constructor(private attendanceService: AttendanceService,
              public _service: AuthService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    this.month = moment().month();
    this.year = moment().year();
    super.ngOnInit();
  }

  /**
   * fetch server data for visits
   */
  protected fetch() {
    this.loading = true;
    if (this.month && this.year) {
      this.attendanceService.leave_report(this.month + 1, this.year, this.region_id).subscribe(
        response => {

          // get regions
          this.regions = response.regions.map(region => new Region(region));

          // get users
          let users = response.users.map(user => new User(user));

          // get attendances
          let attendances = response.attendances.map(att => new Attendance(att));


          // prepare data for display
          this.prepareData(users, attendances);

          this.loading = false;
        }
      );
    }
  }

  prepareData(users: User[], attendances: Attendance[]) {
    this.regions.map(region => {
      region.areas.map(area => {
        area.headquarters.map(headquarter => {
          users.map(user => {
            if (user.hq_headquarter_id == headquarter.id) {
              attendances.map(attendance => {

                // User id and attendance created by same
                if (user.id == attendance.created_by) {

                  // Casual Leave
                  if (attendance.leave_type_id == 1) {
                    user.casual_leave = attendance.casual_leave_count;
                  }

                  // Sick Leave
                  if (attendance.leave_type_id == 2) {
                    user.sick_leave = attendance.sick_leave_count;
                  }

                  // Privilege Leave
                  if (attendance.leave_type_id == 3) {
                    user.privilege_leave = attendance.privilege_leave_count;
                  }
                }
              });
            }
          })
        });
      });
    });
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
   * when region is changed filter list of customer
   * @param region_id
   */
  regionChanged(region_id) {
    this.region_id = region_id;
    this.fetch();
  }
}
