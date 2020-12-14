import {Component} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {BaseAuthComponent} from '../../../base/base_auth.component';
import {AuthService} from '../../../../services/AuthService';
import {LoginService} from '../../../../services/login.service';
import {User} from '../../../../models/user/user';
import {environment} from '../../../../../environments/environment';

@Component({
  templateUrl: 'connector.component.html',
  styleUrls: ['connector.component.less']
})
export class ConnectorComponent extends BaseAuthComponent {

  submitted: boolean;

  /**
   * error message
   */
  public error: string = '';

  public token: string = '';

  /**
   * Constructor for login pages
   *
   * @param _router
   * @param _service
   */
  constructor(public loginService: LoginService, public _router: Router,
             public _service: AuthService, private activatedRoute: ActivatedRoute) {
    super(_service);
  }

  ngOnInit() {
    // Note: Below 'queryParams' can be replaced with 'params' depending on your requirements
    this.activatedRoute.queryParams.subscribe(params => {
        this.token = decodeURIComponent(params['token']);
        localStorage.setItem('auth_token', this.token);
        this.fetch_data();
    });
  }

  fetch_data() {
    this.loginService.user_data().subscribe(response => {
      if (response.user.username === 'abbottadmin') {
        this._router.navigate(['/visits']);
      } else if (response.user.role_str === this.ROLE_THIRD_PARTY) {
        this._router.navigate(['/visits']);
      } else if (response.user.role_str !== this.ROLE_CSE) {
        this._router.navigate(['/dashboard']);
      } else {
        this._router.navigate(['/attendances/monthly']);
      }
    });
  }
}
