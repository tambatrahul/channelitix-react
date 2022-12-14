import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {V2UserService} from "../../../../services/v2/user.service";
import {AuthService} from "../../../../services/AuthService";
import {FormComponent} from "../../../../components/base/form.component";
import {User} from "../../../../models/user/user";
declare let jQuery: any;
declare let swal: any;

@Component({
  selector: 'password-reset',
  templateUrl: 'password_reset.component.html'
})
export class PasswordResetComponent extends FormComponent {

  /**
   * selected user
   */
  _user: User;

  /**
   * loading identifier
   */
  @ViewChild('password_reset_model')
  password_reset_model: ElementRef;

  /**
   * user to deactivate
   *
   * @type {number}
   */
  @Input()
  set user(user: User) {
    this._user = user;
    if (user.id) {
      jQuery(this.password_reset_model.nativeElement).modal();
    }
  }

  /**
   * get selected user
   *
   * @returns {User}
   */
  get user() {
    return this._user;
  }

  /**
   * event on user deactivating
   *
   * @type {EventEmitter}
   */
  @Output()
  passwordReset = new EventEmitter();

  /**
   * user form
   *
   * @type {void|FormGroup}
   */
  public form = this._fb.group({
    new_password: [""],
    confirm_new_password: [""],
  });

  /**
   * Password Reset user Constructor
   *
   * @param userService
   * @param _router
   * @param _fb
   * @param _service
   */
  constructor(public userService: V2UserService, public _router: Router, public _fb: FormBuilder,
              public _service: AuthService) {
    super(_service);
  }

  reset() {
    this.form.patchValue({
      new_password: [""],
      confirm_new_password: [""]
    });
  }

  /**
   * Deactivate user
   */
  save() {
    let self = this;
    this.submitted = true;
    if (this.form.valid) {
      let data = this.form.value;

      // make server call
      this.userService.reset_password(data, this._user.id).subscribe(
        response => {
          swal({
            title: "Password Reset Successfully",
            text: "I will close in 2 sec.",
            type: "success",
            timer: 1500,
            showConfirmButton: false
          });
          this.reset();
          jQuery(self.password_reset_model.nativeElement).modal('hide');
          self.passwordReset.emit(this._user);
        },
        err => {
          this.errors = err.errors;
        }
      );
    }
  }
}
