import {Component} from "@angular/core";
import * as moment from "moment";
import {User} from "../../models/user/user";
import {AppConstants} from "../../app.constants";
import {VisitService} from "../../services/visit.service";
import {Visit} from "../../models/visit/visit";
import {BaseComponent} from "../base/base.component";
import {AuthService} from "../../services/AuthService";
declare let jQuery: any;

@Component({
  templateUrl: '../../templates/page/visit.component.html',
  styleUrls: ['../../templates/less/visit.component.less']
})
export class VisitComponent extends BaseComponent {

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
   * users
   *
   * @type {{}}
   */
  public users: User[] = [];

  /**
   * User Component Constructor
   *
   */
  constructor(private visitService: VisitService, public _service: AuthService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    super.ngOnInit();
    this.month = moment().month();
    this.year = moment().year();
    this.fetchVisits();
  }

  /**
   * Adding visits to skeleton
   *
   * @param visits
   */
  addVisitToSkeleton(visits: Visit[]) {
    let data_skeleton = {};
    let users:User[] = [];

    // prepare visit skeleton
    for (let visit of visits) {

      // add user if not present
      if (!data_skeleton.hasOwnProperty(visit.created_by)) {
        data_skeleton[visit.created_by] = AppConstants.prepareMonthlySkeleton(this.month, this.year);
        users.push(visit.creator);
      }

      // set visit details
      data_skeleton[visit.created_by][visit.visit_day - 1] = {
        visit_count: visit.visit_count
      };
    }

    // add skeleton to user
    for (let user of users) {
      user.visits = data_skeleton[user.id];
    }

    this.users = users;
  }

  /**
   * load attendance for children of logged in user
   */
  fetchVisits() {
    this.loading = true;
    this.visitService.monthlyCountForChildren(this.month + 1, this.year, this.role_id, this.manager_id).subscribe(
      response => {
        this.loading = false;
        this.addVisitToSkeleton(response.visits);
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
    this.fetchVisits();
  }

  /**
   * when role is changed filter list of visits
   * @param role_id
   */
  roleChanged(role_id) {
    this.role_id = role_id;
    this.manager_role_id = parseInt(role_id) + 1;
    this.managerChanged(0);
  }

  /**
   * when role is changed filter list of users
   *
   * @param manager_id
   */
  managerChanged(manager_id) {
    this.manager_id = manager_id;
    this.fetchVisits();
  }
}
