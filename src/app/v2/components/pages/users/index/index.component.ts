import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {ListComponent} from "../../../../../components/base/list.component";
import {User} from "../../../../../models/user/user";
import {AuthService} from "../../../../../services/AuthService";
import {V2UserService} from "../../../../../services/v2/user.service";
import {AppConstants} from "../../../../../app.constants";
declare let jQuery: any;

@Component({
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.less']
})
export class V2UserComponent extends ListComponent {

  /**
   * pages number for users and total users
   *
   * @type {number}
   */
  public page: number = 1;
  public total: number = 10;

  /**
   * user role id and status
   *
   * @type {number}
   */
  public role_id: number = 0;
  public status: string = "active";


  /**
   * region and area identifiers
   *
   * @type {number}
   */
  public region_id: number = 0;
  public area_id: number = 0;


  /**
   * deactivating user
   */
  public deactivating_user: User = new User({});

  /**
   * Resetting User Password
   */
  public reset_password: User = new User({});

  /**
   * users
   *
   * @type {{}}
   */
  public users: User[] = [];

  /**
   * User Component Constructor
   */
  constructor(private userService: V2UserService, public _router: Router, public _service: AuthService) {
    super(_service);
  }

  /**
   * initialize component
   */
  ngOnInit() {
    if (this._service.user.hq_region_id)
      this.region_id = this._service.user.hq_region_id;

    super.ngOnInit();
  }

  /**
   * load users for logged in user
   */
  fetch() {
    this.loading = true;
    this.userService.all(this.role_id, this.status, this.region_id, this.area_id, this.page, 10).subscribe(
      response => {
        this.users = response.users;
        this.total = response.total;
        this.loading = false;
      },
      err => {
        this.loading = false;
      }
    );
  }

  /**
   * when role is changed filter list of users
   *
   * @param role_id
   */
  roleChanged(role_id) {
    this.role_id = role_id;
    this.fetch();
  }


  /**
   * Update User
   */
  updateUser(id: number) {
    this._router.navigate(['/users/update/', id]);
  }

  /**
   *
   */
  deactivateUser(user) {
    this.deactivating_user = user;
  }

  /**
   * on user deactivation
   *
   * @param data
   */
  onUserDeactivation(data) {
    this.deactivating_user = new User({});
    this.fetch();
  }

  /**
   * Reset Password
   */
  passwordReset(user) {
    this.reset_password = user;
  }

  /**
   * on user reset password
   *
   * @param data
   */
  onPasswordReset(data) {
    this.reset_password = new User({});
    this.fetch();
  }

  /**
   * Page changed
   *
   * @param page
   */
  pageChanged(page) {
    this.page = page;
    this.fetch();
  }

  /**
   * when region is changed filter list of customer
   * @param region_id
   */
  regionChanged(region_id) {
    this.region_id = region_id;
    this.areaChanged(0);
  }

  /**
   * when area is changed filter list of customer
   * @param area_id
   */
  areaChanged(area_id) {
    this.area_id = area_id;
    this.fetch();
  }

  /**
   * when starus is changed filter list of customer
   * @param starus
   */
  statusChanged(starus) {
    this.status = starus;
    this.fetch();
  }

  /**
   * get role of user
   *
   * @param role_id
   * @returns {Role|{name: string}}
   */
  getRole(role_id) {
    return AppConstants.getRole(role_id).title;
  }
}
