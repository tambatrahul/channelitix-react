import {Component} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Validators, FormBuilder} from '@angular/forms';
import {LoginService} from '../../../../services/login.service';
import {FormComponent} from '../../../base/form.component';
import {AuthService} from '../../../../services/AuthService';
import {User} from '../../../../models/user/user';
import {environment} from '../../../../../environments/environment';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.less']
})
export class LoginComponent extends FormComponent {

  submitted: boolean;

  /**
   * error message
   */
  public error: string = '';

  public token: string = '';

  /**
   * login form
   *
   * @type {void|FormGroup}
   */
  public form = this._fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  /**
   * Constructor for login pages
   *
   * @param loginService
   * @param _router
   * @param _fb
   * @param _service
   */
  constructor(public loginService: LoginService, public _router: Router,
              public _fb: FormBuilder, public _service: AuthService, private activatedRoute: ActivatedRoute) {
    super(_service);
  }

  ngOnInit() {
    // Note: Below 'queryParams' can be replaced with 'params' depending on your requirements
    this.activatedRoute.queryParams.subscribe(params => {
        this.token = params['token'];
        console.log(this.token);
      });
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
          localStorage.setItem('user', this.token);
          /*localStorage.setItem('user', JSON.stringify(response.user));*/
          this._service.user = new User(response.user);

          if (response.user.username === 'abbottadmin') {
            this._router.navigate(['/visits']);
          } else if (response.user.role_str === this.ROLE_THIRD_PARTY) {
            this._router.navigate(['/visits']);
          } else if (response.user.role_str !== this.ROLE_CSE) {
            this._router.navigate(['/dashboard']);
          } else {
            this._router.navigate(['/attendances/monthly']);
          }
          this.loading = false;
        },
        err => {
          this.loading = false;
          this.error = 'Invalid login details';
        }
      );
    }
  }
}
