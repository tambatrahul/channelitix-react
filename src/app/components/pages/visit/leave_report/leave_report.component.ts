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

  /**
   * year and month for calendar
   *
   * @type {number}
   */
  public month: number;
  public year: number;

  /**
   * region identifier
   */
  public region_id: number = 0;

  /**
   * area identifier
   */
  public area_id: number = 0;

  /**
   * regions
   *
   * @type {Array}
   */
  regions: Region[] = [];

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

    if (environment.envName == 'geo') {
      if (this._service.user.role_id == 4) {
        this.region_id = this._service.user.hq_region_id;
        this.area_id = this._service.user.hq_area_id;
      }
      else if (this._service.user.role_id == 5) {
        this.region_id = this._service.user.hq_region_id;
      }
    }
    else {
      if (this._service.user.role_id == 4) {
        this.region_id = this._service.user.hq_region_id;
        this.area_id = this._service.user.hq_area_id;
      }
      else if (this._service.user.role_id == 5) {
        this.region_id = this._service.user.hq_region_id;
      }
      else {
        if (this._service.user.role_id == 6) {
          this.region_id = 1;
        }
      }
    }

    super.ngOnInit();
  }

  /**
   * fetch server data for visits
   */
  protected fetch() {
    if (this.month && this.year) {
      this.loading = true;
      this.attendanceService.leave_report(this.month + 1, this.year, this.region_id).subscribe(
        response => {

          // get regions
          let regions = response.regions.map(region => new Region(region));

          // get users
          let users = response.users.map(user => new User(user));

          // get attendances
          let attendances = response.attendances.map(att => new Attendance(att));

          // prepare data for display
          this.prepareData(regions, users, attendances);

          this.loading = false;
        },
        err => {
          this.loading = false;
        });
    }
  }

  prepareData(regions: Region[], users: User[], attendances: Attendance[]) {
    regions.map(region => {
      region.areas.map(area => {
        area.headquarters.map(headquarter => {

          attendances.map(attendance => {

            // User id and attendance created by same
            if (headquarter.id == attendance.creator.hq_headquarter_id) {

              // Casual Leave
              if (attendance.leave_type_id == 1) {
                headquarter.casual_leave = attendance.leave_count;
              }

              // Sick Leave
              if (attendance.leave_type_id == 2) {
                headquarter.sick_leave = attendance.leave_count;
              }

              // Privilege Leave
              if (attendance.leave_type_id == 3) {
                headquarter.privilege_leave = attendance.leave_count;
              }
            }
          });

          users.map(user => {
            if (headquarter.id == user.hq_headquarter_id) {
              headquarter.user = new User(user);
            }
          });
        });
        users.map(user => {
          if (area.id == user.hq_area_id) {
            if (user.role_id == 4)
              area.user = new User(user);
          }
        });
      });
      users.map(user => {
        if (region.id == user.hq_region_id) {
          if (user.role_id == 5)
            region.user = new User(user);
        }
      });
    });

    if (this.region_id && this.region_id > 0)
      regions = regions.filter(region => region.id == this.region_id);

    if (this.area_id && this.area_id > 0) {
      regions.map(region => {
        region.areas = region.areas.filter(a => a.id == this.area_id);
      });
    }

    this.regions = regions;
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
    this.area_id = 0;
    this.fetch();
  }

  /**
   * when area is changed filter list of customer
   * @param area_id
   */
  areaChanged(area_id) {
    this.area_id = area_id;
    this.fetch();
  }
}
