import {Component, ViewChild, ElementRef} from '@angular/core';
import * as moment from 'moment';
import {User} from '../../../../models/user/user';
import {AppConstants} from '../../../../app.constants';
import {VisitService} from '../../../../services/visit.service';
import {Visit} from '../../../../models/visit/visit';
import {BaseAuthComponent} from '../../../base/base_auth.component';
import {AuthService} from '../../../../services/AuthService';
import {Holiday} from '../../../../models/holiday';
import {AttendanceService} from '../../../../services/attendance.service';
import {Attendance} from '../../../../models/attendance/attendance';
import {Observable} from 'rxjs/Rx';

declare let jQuery: any;
declare let d3: any;
declare let swal: any;

@Component({
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.less']
})
export class VisitComponent extends BaseAuthComponent {

  excel_loaded: boolean = false;
  btn_loading: boolean = false;
  /**
   * loading identifier
   */
  @ViewChild('visit_table')
  visit_table: ElementRef;

  /**
   * user id
   */
  user: User;

  /**
   * date
   */
  date: number;

  /**
   * manager and user Role id
   * @type {number}
   */
  public role_id: number = 0;
  public manager_role_id: number = 0;
  public department_id: number = 0;


  /**
   * abbott check
   *
   * @type {boolean}
   */
  public abbott: boolean = false;

  /**
   * manager_id
   */
  public manager_id: number = 0;

  public options: {};
  public chart_data = [];

  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public year: number;

  /**
   * customer type id
   */
  customer_type_id: number = 0;
  zone_id: number = 0;

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
    return moment().year(this.year).month(this.month).format('MMMM, YYYY');
  }

  /**
   * users
   *
   * @type {{}}
   */
  public users: User[] = [];

  /**
   * list of attendances
   * @type {Array}
   */
  public attendances: Attendance[] = [];

  /**
   * users
   *
   * @type {{}}
   */
  public managers: User[] = [];

  /**
   * User Component Constructor
   *
   */
  constructor(public visitService: VisitService, public attendanceService: AttendanceService,
              public _service: AuthService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    if (this._service.user.hq_zone_id)
      this.zone_id = this._service.user.hq_zone_id;
    super.ngOnInit();
    if (this._service.user.username == 'abbottadmin') {
      this.abbott = true;
    }

    if(this._service.user.role_str == 'COUNTRY_MNG')
      this.zone_id = 1;

    if (this._service.user.departments.length > 0)
      this.department_id = 0;

    if (this._service.user.departments.length > 0 && this._service.user.role_id == 6 )
      this.department_id = this._service.user.departments[0].pivot.department_id;

    this.month = moment().month();
    this.year = moment().year();
    this.fetchData();
  }

  /**
   * Adding visits to skeleton
   *
   * @param users
   * @param visits
   * @param holidays
   * @param attendances
   */
  addVisitToSkeleton(users: User[], visits: Visit[], holidays: Holiday[], attendances: Attendance[]) {
    let data_skeleton = {};
    let managers: User[] = [];
    let zone_managers: User[] = [];

    // get skeleton
    for (let user of users) {
      data_skeleton[user.id] = AppConstants.prepareMonthVisitSkeleton(this.month, this.year, holidays);
    }

    // prepare visit skeleton
    for (let visit of visits) {
      // add user if not present
      if (!data_skeleton.hasOwnProperty(visit.created_by)) {
        data_skeleton[visit.created_by] = AppConstants.prepareMonthVisitSkeleton(this.month, this.year, holidays);
        users.push(visit.creator);
      }

      // set visit details
      data_skeleton[visit.created_by][visit.visit_day - 1].visit_count = visit.visit_count;
    }

    // add attendance to visit skeleton
    for (let att of attendances) {
      if (data_skeleton.hasOwnProperty(att.created_by)) {
        data_skeleton[att.created_by][moment(att.date, 'YYYY-MM-DD').date() - 1].attendance = att;
        if (data_skeleton[att.created_by][moment(att.date, 'YYYY-MM-DD').date() - 1].visit_count == 0
          && att.status == AppConstants.WORKING) {
          data_skeleton[att.created_by][moment(att.date, 'YYYY-MM-DD').date() - 1].visit_count = att.no_of_calls;
        }
      }
    }

    // add skeleton to user
    for (let user of users) {
      if (data_skeleton.hasOwnProperty(user.id)) {
        user.visits = data_skeleton[user.id];
      } else {
        user.visits = AppConstants.prepareMonthVisitSkeleton(this.month, this.year, holidays);
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
      this._service.user.visits = AppConstants.prepareMonthVisitSkeleton(this.month, this.year, holidays);
      this._service.user.children = [];
      this._service.user.cse_count = 0;
      zone_managers.push(this._service.user)
    }

    // if user is zone manager add it to list
    if (this._service.user.role_str == this.ROLE_CSM) {
      this._service.user.visits = AppConstants.prepareMonthVisitSkeleton(this.month, this.year, holidays);
      this._service.user.children = [];
      managers.push(this._service.user)
    }

    // add children to managers
    for (let u of users) {
      for (let m of managers) {
        if (u.manager_id == m.id) {
          m.children.push(u);
          u.visits.forEach(function (vis, index) {
            if (m.children.length == 1) {
              m.visits[index].visit_count = 0;
            }
            m.visits[index].visit_count += vis.visit_count;
          });
        }
      }
    }

    // add to zone manager
    for (let z of zone_managers) {
      for (let m of managers) {
        if (m.manager_id == z.id || m.manager_id == z.access_id) {
          z.children.push(m);
          m.visits.forEach(function (vis, index) {
            z.visits[index].visit_count += vis.visit_count;
          });
        }
      }
    }

    if (this._service.user.role_str == this.ROLE_ADMIN && this.abbott && this.environment.envName == 'sk_group') {
      let abbott_user = new User({full_name: 'Abbott'});
      abbott_user.visits = AppConstants.prepareMonthVisitSkeleton(this.month, this.year, holidays);
      abbott_user.children = [];
      abbott_user.cse_count = 0;
      zone_managers.push(abbott_user);
      for (let m of managers) {
        zone_managers[0].children.push(m);
        m.visits.forEach(function (att, index) {
          zone_managers[0].visits[index].visit_count += att.visit_count;
        });
        zone_managers[0].cse_count += m.children.length

      }
    }

    if (this.environment.envName == 'sk_group' && this.abbott && this._service.user.role_str != this.ROLE_ADMIN) {
      let abbott_user = new User({full_name: 'Abbott'});
      abbott_user.visits = AppConstants.prepareMonthVisitSkeleton(this.month, this.year, holidays);
      abbott_user.children = [];
      abbott_user.cse_count = 0;
      zone_managers.push(abbott_user);
      for (let m of managers) {
        zone_managers[0].children.push(m);
        m.visits.forEach(function (att, index) {
          zone_managers[0].visits[index].visit_count += att.visit_count;
        });
        zone_managers[0].cse_count += m.children.length

      }
    }

    // if (this._service.user.role_str == this.ROLE_THIRD_PARTY) {
    //   let abbott_user = this._service.user;
    //   abbott_user.visits = AppConstants.prepareMonthVisitSkeleton(this.month, this.year, holidays);
    //   abbott_user.children = [];
    //   abbott_user.cse_count = 0;
    //   zone_managers.push(abbott_user);
    //   for (let m of managers) {
    //     zone_managers[0].children.push(m);
    //     m.visits.forEach(function (att, index) {
    //       zone_managers[0].visits[index].visit_count += att.visit_count;
    //     });
    //     zone_managers[0].cse_count += m.children.length
    //
    //   }
    // }

    // depending on list show view
    if (zone_managers.length > 0) {
      this.managers = zone_managers;
    } else {
      this.managers = managers;
    }

    setTimeout(() => {
      if (!this.excel_loaded) {
        this.excel_loaded = true;
        jQuery('table').tableExport({
          formats: ['xlsx'],
          bootstrap: true,
          position: 'top'
        });
      }
    }, 1000);

  }

  /**
   * fetch server data for visits
   */
  fetchData() {
    this.loading = true;
    let synergy;
    if (this.environment.envName == 'sk_group') {
      synergy = this.abbott ? 1 : 0;
    }

    Observable.forkJoin(
      this.attendanceService.forChildren(this.month + 1, this.year, this.role_id, this.manager_id, synergy, this.zone_id, this.department_id),
      this.visitService.monthlyCountForChildren(this.month + 1, this.year, this.role_id, this.manager_id, synergy, this.customer_type_id,
        this.zone_id, this.department_id)
    ).subscribe(data => {

      this.loading = false;

      // convert to visits
      let visits: Visit[] = data[1].visits.map(vis => new Visit(vis));

      // convert to holidays
      let holidays: Holiday[] = data[1].holidays.map(holi => new Holiday(holi));

      // convert to models
      let children: User[] = data[1].children.map(user => new User(user));

      // convert to attendances
      let attendances = data[0].attendances.map(att => new Attendance(att));

      this.addVisitToSkeleton(children, visits, holidays, attendances);
    }, err => {
      this.loading = false;
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
    this.excel_loaded = false;
    this.fetchData();
  }

  /**
   * customer type changed
   * @param c_t_id
   */
  customerTypeChanged(c_t_id) {
    this.customer_type_id = c_t_id;
    this.fetchData();
  }

  /**
   * customer type changed
   * @param zone_id
   */
  zoneChanged(zone_id) {
    this.zone_id = zone_id;
    this.fetchData();
  }

  /**
   * switch to abbott
   */
  switchToAbbott() {
    this.abbott = !this.abbott;
    this.excel_loaded = false;
    this.fetchData();
  }
  /**
   * department Filter
   *
   * @param department_id
   */
  departmentChanged(department_id) {
    this.department_id = department_id;
    this.fetchData();
  }

  /**
   * select user to view list
   * @param user
   * @param date
   * @param visit
   */
  selectUser(user: User, date: number, visit: Visit) {
    this.user = user;
    this.date = date;
    let popup_date = this.date + ' ' + moment().year(this.year).month(this.month).format('MMMM, YYYY');

    if (visit.attendance.status == 'leave') {
      swal(user.full_name + ' on Leave (' + popup_date + ')');
    } else if (visit.attendance.status == 'holiday') {
      swal(user.full_name + ' on Holiday (' + popup_date + ')');
    } else if (visit.attendance.status == 'working') {
      if (visit.attendance.work_type_id == 4) {
        swal(user.full_name + ' on Transit (' + popup_date + ')');
      } else if (visit.attendance.work_type_id == 1) {
        swal(user.full_name + ' on Meeting (' + popup_date + ')');
      } else if (visit.attendance.work_type_id == 3) {
        swal(user.full_name + ' on Campaign (' + popup_date + ')');
      } else if (visit.attendance.work_type_id == 2) {
        jQuery(this.visit_table.nativeElement).modal();
      }
      else if (visit.attendance.work_type_id == 10) {
          jQuery(this.visit_table.nativeElement).modal();
      }
    }
  }

  /**
   * Download Excel For Stockist POB
   */
  download() {
    this.btn_loading = true;
    let synergy;
    if (this.environment.envName == 'sk_group') {
      synergy = this.abbott ? 1 : 0;
    }

    this.visitService.visit_excel_download(this.month + 1, this.year,
      this.role_id, this.manager_id, synergy, this.customer_type_id, this.zone_id).subscribe(
      response => {
        let blob: Blob = response.blob();

        // Doing it this way allows you to name the file
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'daily_visit_report.xls';
        link.click();
        this.btn_loading = false;

      },
      err => {
        this.btn_loading = false;
      }
    );
  }

}
