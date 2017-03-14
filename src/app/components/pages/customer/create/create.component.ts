import * as moment from "moment";
import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";
import {UserService} from "../../../../services/user.service";
import {FormBuilder} from "@angular/forms";
import {FormComponent} from "../../../base/form.component";
import {AppConstants} from "../../../../app.constants";
declare let jQuery: any;

@Component({
    selector: 'create-customer',
    templateUrl: 'create.component.html',
    styleUrls: ['create.component.less']
})
export class CreateCustomerComponent extends FormComponent {

    /**
     * Customer type and grade
     */
    public customer_type_id: number = 0;
    public grade_id: number = 0;


    /**
     * customer form
     *
     * @type {void|FormGroup}
     */
    public form = this._fb.group({
        full_name: [""],
        email: [""],
        mobile: [""],
        customer_type_id: [""],
        grade_id: [""]
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
     * create user
     */
    save() {
        this.submitted = true;
        if (this.form.valid) {
            this.loading = true;
            let data = this.form.value;

            this.userService.create(data).subscribe(
                response => {
                    localStorage.setItem("user", JSON.stringify(response.user));
                    this._router.navigate(['/users']);
                    this.loading = false;
                },
                err => {
                    this.loading = false;
                    console.log(err);
                    this.errors = err.errors;
                }
            );
        }
    }

    /**
     * Type changed
     */
    typeChanged(customer_type_id) {
        this.customer_type_id = customer_type_id;
    }

    /**
     * Grade changed
     */
    gradeChanged(grade_id) {
        this.grade_id = grade_id;
    }

}
