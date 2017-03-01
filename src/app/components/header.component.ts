import {Component} from "@angular/core";
import {AuthService} from "../services/AuthService";
import {User} from "../models/user/user";

@Component({
  selector: 'header-comp',
  templateUrl: '../templates/header.component.html'
})
export class HeaderComponent {

  /**
   * Logged in user
   */
  public user: User;

  /**
   * Header component constructor
   *
   * @param _authService
   */
  constructor(private _authService: AuthService) {
    this.user = _authService.user;
  }

  /**
   * logout user
   */
  logout() {
    this._authService.logout();
  }
}
