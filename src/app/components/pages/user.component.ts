import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../services/AuthService";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user/user";
import {ListComponent} from "../base/list.component";
declare let jQuery: any;


@Component({
  templateUrl: '../../templates/pages/user.component.html',
  styleUrls: ['../../templates/less/user.component.less']
})
export class UserComponent extends ListComponent {

  /**
   * manager and user Role id
   *
   * @type {number}
   */
  public role_id: number = 0;
  public manager_role_id: number = 0;

  /**
   * deactivating user
   */
  public deactivating_user: User = new User({});

  /**
   * Resetting User Password
   */
  public reset_password: User = new User({});

  /**
   * manager_id
   */
  public manager_id: number = 0;

  /**
   * users
   *
   * @type {{}}
   */
  public users: User[] = [];

  /**
   * User Component Constructor
   */
  constructor(private userService: UserService, public _router: Router,public _service: AuthService) {
    super(_service);
  }

  /**
   * load users for logged in user
   */
  fetch() {
    this.loading = true;
    this.userService.children(this.role_id, this.manager_id).subscribe(
      response => {
        this.loading = false;
        this.users = response.users;
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
    this.manager_role_id = role_id != 0 ? parseInt(role_id) + 1 : 0;
    this.managerChanged(0);
    this.fetch();
  }

  /**
   * when role is changed filter list of users
   *
   * @param manager_id
   */
  managerChanged(manager_id) {
    this.manager_id = manager_id;
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
}
