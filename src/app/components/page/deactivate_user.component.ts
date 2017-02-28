import * as moment from "moment";
import {Component} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/AuthService";
import {FormComponent} from "../base/form.component";

@Component({
    templateUrl: '../../templates/page/deactivate_user.component.html',
    styleUrls: ['../../templates/less/user.component.less']
})

export class DeactivateUserComponent extends FormComponent{

    public user_id: number = 0;
    public deactivate_date: string;

    /**
     * user form
     *
     * @type {void|FormGroup}
     */
    public form = this._fb.group({
        deactivate_date: [""],
        user_id : [""]
    });

    /**
     * Deactivate user Constructor
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
     * Deactivate user
     */
    save() {
        this.submitted = true;
        if (this.form.valid) {
            let data = this.form.value;

            // format Deactivate date
            if (this.deactivate_date)
                data.deactivate_date = moment(data.deactivate_date, "DD MMMM YYYY").format('YYYY-MM-DD');

            this.userService.deactivate(data, this.user_id).subscribe(
                response => {
                    localStorage.setItem("user", JSON.stringify(response.user));
                    this._router.navigate(['/users']);
                },
                err => {
                    this.errors = err.errors;
                }
            );
        }
    }

    /**
     * on deactivate date changed
     */
    dateChanged(date) {
        this.deactivate_date = date;
        this.form.patchValue({deactivate_date: date});
    }
}