import {Component} from "@angular/core";
import {AuthService} from "../services/AuthService";

@Component({
  selector: 'header-comp',
  templateUrl: '../templates/header.component.html'
})
export class HeaderComponent {

  constructor(private _authService: AuthService) {

  }

  /**
   * logout user
   */
  logout() {
    this._authService.logout();
  }
}
