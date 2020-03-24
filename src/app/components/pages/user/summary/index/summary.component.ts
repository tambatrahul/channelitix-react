import {Component, ViewChild, ElementRef} from "@angular/core";
import * as moment from "moment";
import {BaseAuthComponent} from "../../../../base/base_auth.component";
import {User} from "../../../../../models/user/user";
import {AuthService} from "../../../../../services/AuthService";
import {UserService} from "../../../../../services/user.service";
import {AppConstants} from "../../../../../app.constants";

declare let jQuery: any;

@Component({
  templateUrl: 'summary.component.html',
  styleUrls: ['summary.component.less']
})
export class SummaryComponent extends BaseAuthComponent {

  /**
   * user tour program modal loading identifier
   */
  @ViewChild('user_tour_program_modal')
  user_tour_program_modal: ElementRef;

  /**
   * Resetting User Password
   */
  user: User;

  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public year: number;
  public search: string = "";
  /**
   * users
   *
   * @type {{}}
   */
  public users: User[] = [];
  public _users: User[] = [];

  /**
   * User List
   *
   * @param _service
   * @param userService
   */
  constructor(public _service: AuthService, public userService: UserService) {
    super(_service);
  }

  /**
   * on start of app set this details
   */
  ngOnInit() {
    super.ngOnInit();
    this.month = moment().month();
    this.year = moment().year();
    this.fetch();
  }

  /**
   * load users for logged in user
   */
  fetch() {
    this.loading = true;
    this.userService.children(0, 0, 'active', this.search).subscribe(
      response => {
        this.users = response.users.map(function (user) {
          return new User(user);
        });
        this._users = this.users;
        this.user = this.users[0];
        this.loading = false;
      },
      err => {
        this.loading = false;
      }
    );
  }

  /**
   * On User Selected
   *
   * @param user
   */
  onUserSelected(user: User) {
    this.user = user;
  }

  /**
   * month and year changed
   *
   * @param date
   */
  monthYearChanged(date) {
    this.month = date.month;
    this.year = date.year;
  }

  /**
   * show list of tours
   * @param user
   */
  onShowTour() {
    jQuery(this.user_tour_program_modal.nativeElement).modal();
  }

  /**
   * on search added
   */
  onKey(event: any) {
    this.search = event.target.value;
    this.fetch();
  }
  // onKey(search: string) {
  //   this._users = this.users.filter(function (user) {
  //     let u = user.full_name.includes(search);
  //     if (user.hq_headquarter)
  //       u = user.hq_headquarter.name.includes(search);
  //     return u;
  //   });
  // }

  clear() {

  }

  /**
   * after the view is checked
   */
  ngAfterViewChecked() {
    // get window height
    let wh = jQuery(window).height();

    // get container
    let AppsContainer = jQuery('.apps-container');

    // get offset to be reduced
    let AppsTopOffset = 0;
    if (AppsContainer.length) {
      AppsTopOffset = AppsContainer.offset().top + 60;
    }

    // get actual height
    let AppsCalH = wh - AppsTopOffset;

    // set height
    jQuery('.apps-panel-scroll').css({
      'height': AppsCalH + 'px'
    });
    jQuery('.task-info').css({
      'height': AppsCalH - 130 + 'px'
    });

    // set width of task body
    let NoteSideW = jQuery('.task-sidebar').width();
    let NoteListW = jQuery('.task-list').width();
    let NoteBodyCal = jQuery(window).width() - (NoteSideW + NoteListW);
    jQuery('.task-body').css({
      'width': (NoteBodyCal - jQuery('.left-aside').width()) + 'px'
    });
  }
}
