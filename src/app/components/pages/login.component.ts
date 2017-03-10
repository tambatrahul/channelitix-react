import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {Validators, FormBuilder} from "@angular/forms";
import {CookieService} from "angular2-cookie/services/cookies.service";
import {LoginService} from "../../services/login.service";
import {FormComponent} from "../base/form.component";
import {AuthService} from "../../services/AuthService";

@Component({
  templateUrl: '../../templates/pages/login.component.html',
  styleUrls: ['../../templates/less/login.component.less']
})
export class LoginComponent extends FormComponent {

  submitted: boolean;

  /**
   * error message
   */
  public error: string = '';

  /**
   * login form
   *
   * @type {void|FormGroup}
   */
  public form = this._fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required]
  });

  /**
   * Constructor for login pages
   *
   * @param loginService
   * @param _router
   * @param _fb
   * @param _service
   * @param _cookieService
   */
  constructor(public loginService: LoginService, public _router: Router,
              public _fb: FormBuilder, public _service: AuthService, private _cookieService: CookieService) {
    super(_service);
  }

  /**
   * login user
   */
  save() {
    this.submitted = true;
    if (this.form.valid) {
      this.loading = true;
      let data = this.form.value;
      this.loginService.login(data.username, data.password).subscribe(
        response => {
          localStorage.setItem("user", JSON.stringify(response.user));
          this._service.user = response.user;
          this._router.navigate(['/users']);
          this.loading = false;
        },
        err => {
          this.loading = false;
          this.error = "Invalid login details";
        }
      );
    }
  }
}
