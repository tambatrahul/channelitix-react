import {Component} from "@angular/core";

@Component({
  templateUrl: './templates/login.component.html',
  styleUrls: ['./templates/login.component.less']
})
export class LoginComponent {
  email = '';
  password = '';
}
