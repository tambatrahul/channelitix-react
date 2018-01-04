import {Component, Input} from "@angular/core";
import * as moment from "moment";
import {User} from "../../../../models/user/user";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {AuthService} from "../../../../services/AuthService";
import {Visit} from "../../../../models/visit/visit";
import {VisitService} from "../../../../services/visit.service";
declare let jQuery: any;

@Component({
  selector: 'user-visit-list',
  templateUrl: 'user_visit_list.component.html',
  styleUrls: ['user_visit_list.component.less']
})
export class UserVisitListComponent extends BaseAuthComponent {

  /**
   * selected visit id
   */
  selectedVisitId: number;

  _user: User;
  @Input()
  set user(user) {
    this._user = user;
    this.fetch();
  }

  /**
   * month for report
   */
  @Input()
  month: number;

  /**
   * year for report
   */
  @Input()
  year: number;

  /**
   * date for report
   */
  _date: number;
  @Input()
  set date(date: number) {
    this._date = date;
    this.fetch();
  }

  /**
   * get title of table
   * @returns {string}
   */
  get title(): string {
    return this._date + " " + moment().year(this.year).month(this.month).format("MMMM, YYYY") + " for " + this._user.full_name;
  }

  /**
   * visits
   *
   * @type {{}}
   */
  public visits: Visit[] = [];

  /**
   * Visit
   *
   * @param visitService
   * @param _service
   */
  constructor(private visitService: VisitService, public _service: AuthService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * fetch server data for visits
   */
  fetch() {
    if ((this.month || this.month == 0) && this.year && this._user && this._date) {
      this.loading = true;
      this.visitService.forUser(this._user.id, this.month + 1, this.year, this._date).subscribe(
        response => {
          this.visits = response.visits.map(visit => new Visit(visit));
          this.loading = false;
        },
        err => {
          this.loading = false;
        }
      )
    }
  }

  /**
   * select visit
   *
   * @param visit_id
   */
  selectVisit(visit_id: number) {
    this.selectedVisitId = visit_id;
  }
}
