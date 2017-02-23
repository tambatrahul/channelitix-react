import {Component, Input, Output, EventEmitter} from "@angular/core";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user/user";

@Component({
  selector: 'user-select',
  templateUrl: 'templates/user-select.component.html'
})
export class UserSelectComponent {

  /**
   * selected user
   */
  @Input()
  user_id: number;

  /**
   * title for select field
   */
  @Input()
  title: string = "Select User";

  /**
   * event on user changed
   *
   * @type {EventEmitter}
   */
  @Output()
  onUserChanged = new EventEmitter();

  /**
   * loading for server call
   * @type {boolean}
   */
  private loading: boolean = false;

  /**
   * role id for filter
   */
  private _role_id: number;

  /**
   * user list
   *
   * @type {Array}
   */
  private users: User[] = [];

  constructor(private userService: UserService) {
  }

  /**
   * on load of component load users
   */
  ngOnInit() {
    this.fetch();
  }

  /**
   * role_id getter and setters
   *
   * @param role_id
   */
  @Input()
  set role_id(role_id: number) {
    console.log(role_id);
    this._role_id = role_id;
    this.fetch();
  }

  get role_id(): number {
    return this._role_id;
  }

  /**
   * load users
   */
  fetch() {
    this.loading = true;
    this.userService.children(this._role_id).subscribe(
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
   * emit on change of value
   */
  onUserChange(u_id) {
    this.user_id = u_id;
    this.onUserChanged.emit(u_id);
  }
}
