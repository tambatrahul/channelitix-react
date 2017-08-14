import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";
import {UserService} from "../../../../services/user.service";
import {FormBuilder} from "@angular/forms";
import {FormComponent} from "../../../base/form.component";
declare let jQuery: any;
declare let swal: any;

@Component({
    templateUrl: 'reset_password.component.html',

})
export class ResetPasswordComponent extends FormComponent {


    /**
     * user form
     *
     * @type {void|FormGroup}
     */
    public form = this._fb.group({
        new_password: [""],
        confirm_new_password: [""]
    });

    /**
     * Create user Constructor
     *
     * @param userService
     * @param _router
     * @param _fb
     * @param _service
     */
    constructor(public userService: UserService, public _router: Router, public _fb: FormBuilder,
                public _service: AuthService) {
        super(_service);
    }

    /**
     * initialize details
     */
    ngOnInit() {
        super.ngOnInit();
    }

    reset() {
        this.form.patchValue({
            new_password: [""],
            confirm_new_password : [""]
        });
    }
    /**
     * create user
     */
    save() {
        this.submitted = true;
        if (this.form.valid) {
            this.loading = true;
            let data = Object.assign({}, this.form.value);

            this.userService.reset_user_password(data, this._service.user.id).subscribe(
                response => {
                    swal({
                        title: "Password Reset Successfully",
                        text: "I will close in 2 sec.",
                        type: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });
                    this.reset();
                    this.loading = false;
                },
                err => {
                    this.loading = false;
                    this.errors = err.errors;
                }
            );
        }
    }
}
