import {Component} from "@angular/core";
import {User} from "../../../models/user/user";
import {UserService} from "../../../base/services/user.service";
import {AuthService} from "../../../base/services/AuthService";
import {ListComponent} from "../../../base/components/list.component";
declare let jQuery: any;


@Component({
  templateUrl: 'templates/index.component.html',
  styleUrls: ['templates/less/index.component.less']
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
  constructor(private userService: UserService, public _service: AuthService) {
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
    this.manager_role_id = parseInt(role_id) + 1;
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
}
