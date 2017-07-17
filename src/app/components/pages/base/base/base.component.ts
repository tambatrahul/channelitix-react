import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";

@Component({
  templateUrl: 'base.component.html'
})
export class BaseComponent {

  constructor(protected _router: Router, public _service: AuthService) {
  }
}
