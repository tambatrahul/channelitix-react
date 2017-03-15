import * as moment from "moment";
import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../../../services/user.service";
import {AuthService} from "../../../../services/AuthService";
import {FormComponent} from "../../../base/form.component";
import {User} from "../../../../models/user/user";
declare let jQuery: any;

@Component({
    selector: 'deactivate-user',
    templateUrl: 'deactivate_user.component.html'
})
export class DeactivateUserComponent extends FormComponent {

    private _user: User;

    /**
     * loading identifier
     */
    @ViewChild('deactivating_modal')
    deactivating_modal: ElementRef;

    /**
     * user to deactivate
     *
     * @type {number}
     */
    @Input()
    set user(user: User) {
        this._user = user;
        if (user.id) {
            jQuery(this.deactivating_modal.nativeElement).modal();
        }
    }

    get user() {
        return this._user;
    }

    /**
     * event on user deactivating
     *
     * @type {EventEmitter}
     */
    @Output()
    userDeactivated = new EventEmitter();

    /**
     * user form
     *
     * @type {void|FormGroup}
     */
    public form = this._fb.group({
        leaving_date: [""]
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
        let self = this;
        this.submitted = true;
        if (this.form.valid) {
            let data = this.form.value;

            // format Deactivate date
            if (data.leaving_date)
                data.leaving_date = moment(data.leaving_date, "DD MMMM YYYY").format('YYYY-MM-DD');

            // make server call
            this.userService.deactivate(data, this._user.id).subscribe(
                response => {
                    jQuery(self.deactivating_modal.nativeElement).modal('hide');
                    self.userDeactivated.emit(this._user);
                },
                err => {
                    this.errors = err.errors;
                }
            );
        }
    }

    /**
     * on leaving date changed
     */
    dateChanged(date) {
        this.form.patchValue({leaving_date: date});
    }
}
